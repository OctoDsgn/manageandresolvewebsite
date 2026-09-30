<?php
/**
 * Paid consultation bookings with Foluke Akinmoladun.
 *
 * Flow (driven by the website, authenticated as the "Website forms (API only)" user):
 *   GET  /wp-json/mr/v1/bookings/config  — consultation title, duration, price, rules
 *   GET  /wp-json/mr/v1/bookings/slots   — open slots (Africa/Lagos) for the next N days
 *   POST /wp-json/mr/v1/bookings/hold    — reserve a slot for a few minutes while the client pays
 *   POST /wp-json/mr/v1/bookings/confirm — mark paid after the website has verified it with Paystack
 *
 * WordPress is the calendar of record: weekly hours, blocked dates and bookings all live here.
 * Settings: Consultations → Settings. Month view: Consultations → Calendar.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class MR_Bookings {

	const OPTION    = 'mr_booking_settings';
	const TIMEZONE  = 'Africa/Lagos';
	const POST_TYPE = 'mr_booking';
	const CURRENCY  = 'NGN';
	const CRON_HOOK = 'mr_bookings_expire_holds';

	/** Statuses that occupy a slot (pending holds occupy it only until they expire). */
	const BLOCKING_STATUSES = array( 'confirmed', 'needs_attention', 'completed' );

	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
		add_action( 'init', array( __CLASS__, 'schedule_cleanup' ) );
		add_action( self::CRON_HOOK, array( __CLASS__, 'expire_holds' ) );

		if ( is_admin() ) {
			add_action( 'admin_menu', array( __CLASS__, 'admin_pages' ) );
			add_action( 'admin_post_mr_save_booking_settings', array( __CLASS__, 'save_settings' ) );
		}
	}

	// ---------------------------------------------------------------------------
	// Settings
	// ---------------------------------------------------------------------------

	public static function defaults() {
		$hours = array();
		foreach ( range( 1, 7 ) as $day ) { // ISO-8601: 1 = Monday … 7 = Sunday.
			$hours[ $day ] = array(
				'on'    => $day <= 5 ? 1 : 0,
				'start' => '10:00',
				'end'   => '16:00',
			);
		}
		return array(
			'enabled'      => 0,
			'title'        => 'Consultation with Foluke Akinmoladun',
			'description'  => '',
			'duration'     => 60,
			'price'        => 0,
			'buffer'       => 15,
			'notice_hours' => 24,
			'window_days'  => 30,
			'hold_minutes' => 15,
			'hours'        => $hours,
			'blocked'      => '',
		);
	}

	public static function settings() {
		$saved    = get_option( self::OPTION, array() );
		$defaults = self::defaults();
		$settings = wp_parse_args( is_array( $saved ) ? $saved : array(), $defaults );
		foreach ( $defaults['hours'] as $day => $default ) {
			$settings['hours'][ $day ] = wp_parse_args( $settings['hours'][ $day ] ?? array(), $default );
		}
		return $settings;
	}

	public static function is_open() {
		$settings = self::settings();
		return ! empty( $settings['enabled'] ) && (int) $settings['price'] > 0;
	}

	private static function tz() {
		return new DateTimeZone( self::TIMEZONE );
	}

	/** Blocked dates: one per line, either 2026-12-24 or a range 2026-12-24 to 2027-01-02. */
	private static function blocked_dates( $text ) {
		$blocked = array();
		foreach ( preg_split( '/\r?\n/', (string) $text ) as $line ) {
			if ( ! preg_match( '/^\s*(\d{4}-\d{2}-\d{2})(?:\s*(?:to|-|–)\s*(\d{4}-\d{2}-\d{2}))?\s*$/i', $line, $match ) ) {
				continue;
			}
			$from = DateTimeImmutable::createFromFormat( '!Y-m-d', $match[1], self::tz() );
			$to   = ! empty( $match[2] ) ? DateTimeImmutable::createFromFormat( '!Y-m-d', $match[2], self::tz() ) : $from;
			if ( ! $from || ! $to ) {
				continue;
			}
			for ( $day = $from; $day <= $to && count( $blocked ) < 1000; $day = $day->modify( '+1 day' ) ) {
				$blocked[ $day->format( 'Y-m-d' ) ] = true;
			}
		}
		return $blocked;
	}

	private static function format_naira( $naira ) {
		return '₦' . number_format( (int) $naira );
	}

	private static function when_label( $timestamp ) {
		return ( new DateTimeImmutable( '@' . $timestamp ) )->setTimezone( self::tz() )->format( 'l j F Y, g:i a' ) . ' WAT';
	}

	// ---------------------------------------------------------------------------
	// Availability
	// ---------------------------------------------------------------------------

	/**
	 * Intervals (unix seconds) already taken: confirmed bookings, plus unpaid holds that have
	 * not expired. Each is widened by the buffer so consultations never run back-to-back.
	 */
	private static function busy_intervals( $exclude_id = 0, $include_holds = true ) {
		$settings = self::settings();
		$buffer   = max( 0, (int) $settings['buffer'] ) * 60;
		$now      = time();

		$ids = get_posts(
			array(
				'post_type'      => self::POST_TYPE,
				'post_status'    => 'any',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'post__not_in'   => $exclude_id ? array( $exclude_id ) : array(),
				'meta_query'     => array(
					array(
						'key'     => '_mr_end_ts',
						'value'   => $now,
						'compare' => '>=',
						'type'    => 'NUMERIC',
					),
				),
			)
		);

		$busy = array();
		foreach ( $ids as $id ) {
			$status  = get_post_meta( $id, '_mr_status', true );
			$holding = $include_holds && 'pending_payment' === $status && (int) get_post_meta( $id, '_mr_hold_expires', true ) > $now;
			if ( ! $holding && ! in_array( $status, self::BLOCKING_STATUSES, true ) ) {
				continue;
			}
			$busy[] = array(
				(int) get_post_meta( $id, '_mr_start_ts', true ) - $buffer,
				(int) get_post_meta( $id, '_mr_end_ts', true ) + $buffer,
			);
		}
		return $busy;
	}

	private static function overlaps( $start, $end, $busy ) {
		foreach ( $busy as $interval ) {
			if ( $start < $interval[1] && $end > $interval[0] ) {
				return true;
			}
		}
		return false;
	}

	/** Open slots per day, from $from (Y-m-d, Lagos) for $days days. Times are UTC ISO-8601. */
	public static function available_slots( $from, $days ) {
		$settings = self::settings();
		$tz       = self::tz();
		$duration = max( 15, (int) $settings['duration'] );
		$step     = $duration + max( 0, (int) $settings['buffer'] );
		$earliest = time() + max( 0, (int) $settings['notice_hours'] ) * HOUR_IN_SECONDS;
		$today    = new DateTimeImmutable( 'today', $tz );
		$last_day = $today->modify( '+' . max( 1, (int) $settings['window_days'] ) . ' days' );
		$blocked  = self::blocked_dates( $settings['blocked'] );
		$busy     = self::busy_intervals();

		$start = DateTimeImmutable::createFromFormat( '!Y-m-d', (string) $from, $tz );
		if ( ! $start || $start < $today ) {
			$start = $today;
		}

		$result = array();
		for ( $i = 0; $i < min( 92, max( 1, (int) $days ) ); $i++ ) {
			$day = $start->modify( "+{$i} days" );
			if ( $day > $last_day ) {
				break;
			}
			$key   = $day->format( 'Y-m-d' );
			$hours = $settings['hours'][ (int) $day->format( 'N' ) ];
			$slots = array();

			if ( ! empty( $hours['on'] ) && ! isset( $blocked[ $key ] ) && preg_match( '/^\d{2}:\d{2}$/', $hours['start'] ) && preg_match( '/^\d{2}:\d{2}$/', $hours['end'] ) ) {
				list( $open_h, $open_m )   = array_map( 'intval', explode( ':', $hours['start'] ) );
				list( $close_h, $close_m ) = array_map( 'intval', explode( ':', $hours['end'] ) );
				$close                     = $day->setTime( $close_h, $close_m )->getTimestamp();

				for ( $cursor = $day->setTime( $open_h, $open_m ); $cursor->getTimestamp() + $duration * 60 <= $close; $cursor = $cursor->modify( "+{$step} minutes" ) ) {
					$slot_start = $cursor->getTimestamp();
					$slot_end   = $slot_start + $duration * 60;
					if ( $slot_start >= $earliest && ! self::overlaps( $slot_start, $slot_end, $busy ) ) {
						$slots[] = array(
							'start' => gmdate( 'Y-m-d\TH:i:s\Z', $slot_start ),
							'label' => $cursor->format( 'g:i a' ),
						);
					}
				}
			}
			$result[] = array(
				'date'  => $key,
				'slots' => $slots,
			);
		}
		return $result;
	}

	// ---------------------------------------------------------------------------
	// REST API
	// ---------------------------------------------------------------------------

	public static function register_routes() {
		$permission = function () {
			return current_user_can( MR_Submissions::SUBMIT_CAP );
		};

		register_rest_route(
			'mr/v1',
			'/bookings/config',
			array(
				'methods'             => 'GET',
				'callback'            => array( __CLASS__, 'rest_config' ),
				'permission_callback' => $permission,
			)
		);
		register_rest_route(
			'mr/v1',
			'/bookings/slots',
			array(
				'methods'             => 'GET',
				'callback'            => array( __CLASS__, 'rest_slots' ),
				'permission_callback' => $permission,
			)
		);
		register_rest_route(
			'mr/v1',
			'/bookings/hold',
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'rest_hold' ),
				'permission_callback' => $permission,
			)
		);
		register_rest_route(
			'mr/v1',
			'/bookings/confirm',
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'rest_confirm' ),
				'permission_callback' => $permission,
			)
		);
	}

	public static function rest_config() {
		$settings = self::settings();
		return array(
			'open'            => self::is_open(),
			'title'           => $settings['title'],
			'description'     => $settings['description'],
			'durationMinutes' => (int) $settings['duration'],
			'price'           => (int) $settings['price'],
			'currency'        => self::CURRENCY,
			'timezone'        => self::TIMEZONE,
			'noticeHours'     => (int) $settings['notice_hours'],
			'windowDays'      => (int) $settings['window_days'],
			'holdMinutes'     => (int) $settings['hold_minutes'],
		);
	}

	public static function rest_slots( WP_REST_Request $request ) {
		if ( ! self::is_open() ) {
			return array(
				'timezone' => self::TIMEZONE,
				'days'     => array(),
			);
		}
		$from = preg_match( '/^\d{4}-\d{2}-\d{2}$/', (string) $request['from'] ) ? $request['from'] : '';
		return array(
			'timezone' => self::TIMEZONE,
			'days'     => self::available_slots( $from, $request['days'] ? (int) $request['days'] : 31 ),
		);
	}

	public static function rest_hold( WP_REST_Request $request ) {
		if ( ! self::is_open() ) {
			return new WP_Error( 'mr_booking_closed', 'Online booking is not open.', array( 'status' => 503 ) );
		}
		$settings = self::settings();
		$params   = $request->get_json_params();
		$params   = is_array( $params ) ? $params : array();
		$text     = function ( $key, $max, $textarea = false ) use ( $params ) {
			$raw = isset( $params[ $key ] ) && is_scalar( $params[ $key ] ) ? (string) $params[ $key ] : '';
			return mb_substr( trim( $textarea ? sanitize_textarea_field( $raw ) : sanitize_text_field( $raw ) ), 0, $max );
		};

		$data = array(
			'name'    => $text( 'name', 200 ),
			'email'   => sanitize_email( $text( 'email', 254 ) ),
			'phone'   => $text( 'phone', 30 ),
			'company' => $text( 'company', 200 ),
			'topic'   => $text( 'topic', 2000, true ),
		);
		$start = $text( 'start', 40 );

		$errors = array();
		foreach ( array( 'name', 'phone' ) as $required ) {
			if ( '' === $data[ $required ] ) {
				$errors[ $required ] = 'This field is required.';
			}
		}
		if ( ! is_email( $data['email'] ) ) {
			$errors['email'] = 'Please enter a valid email address.';
		}
		$start_ts = strtotime( $start );
		if ( ! $start_ts ) {
			$errors['start'] = 'Please choose a time.';
		}
		if ( $errors ) {
			return new WP_Error( 'mr_invalid', 'Some fields are invalid.', array( 'status' => 422, 'errors' => $errors ) );
		}

		// The requested time must be one of the currently open slots.
		$local_day = ( new DateTimeImmutable( '@' . $start_ts ) )->setTimezone( self::tz() )->format( 'Y-m-d' );
		$wanted    = gmdate( 'Y-m-d\TH:i:s\Z', $start_ts );
		$open      = false;
		foreach ( self::available_slots( $local_day, 1 ) as $day ) {
			foreach ( $day['slots'] as $slot ) {
				$open = $open || $slot['start'] === $wanted;
			}
		}
		if ( ! $open ) {
			return new WP_Error( 'mr_slot_unavailable', 'That time is no longer available. Please choose another.', array( 'status' => 409 ) );
		}

		$duration  = max( 15, (int) $settings['duration'] );
		$end_ts    = $start_ts + $duration * 60;
		$reference = 'MR-' . strtoupper( wp_generate_password( 14, false, false ) );
		$when      = self::when_label( $start_ts );
		$price     = (int) $settings['price'];

		$post_id = wp_insert_post(
			array(
				'post_type'   => self::POST_TYPE,
				'post_status' => 'private',
				'post_title'  => $data['name'] . ' — ' . $when,
			),
			true
		);
		if ( is_wp_error( $post_id ) ) {
			return new WP_Error( 'mr_save_failed', 'The booking could not be saved.', array( 'status' => 500 ) );
		}

		$meta = array_merge(
			$data,
			array(
				'when'         => $when,
				'amount'       => self::format_naira( $price ),
				'amount_kobo'  => $price * 100,
				'currency'     => self::CURRENCY,
				'reference'    => $reference,
				'status'       => 'pending_payment',
				'start_ts'     => $start_ts,
				'end_ts'       => $end_ts,
				'hold_expires' => time() + max( 5, (int) $settings['hold_minutes'] ) * 60,
				'title'        => $settings['title'],
			)
		);
		foreach ( $meta as $key => $value ) {
			update_post_meta( $post_id, '_mr_' . $key, $value );
		}

		return new WP_REST_Response(
			array(
				'id'          => $post_id,
				'reference'   => $reference,
				'amount'      => $price * 100, // Paystack expects the currency subunit (kobo).
				'currency'    => self::CURRENCY,
				'title'       => $settings['title'],
				'when'        => $when,
				'start'       => gmdate( 'Y-m-d\TH:i:s\Z', $start_ts ),
				'end'         => gmdate( 'Y-m-d\TH:i:s\Z', $end_ts ),
				'holdExpires' => gmdate( 'Y-m-d\TH:i:s\Z', (int) $meta['hold_expires'] ),
			),
			201
		);
	}

	/**
	 * Called only after the website has verified the payment with Paystack (callback page or
	 * signed webhook). Idempotent: repeated calls for the same reference change nothing.
	 */
	public static function rest_confirm( WP_REST_Request $request ) {
		$params    = $request->get_json_params();
		$params    = is_array( $params ) ? $params : array();
		$reference = sanitize_text_field( (string) ( $params['reference'] ?? '' ) );
		$amount    = (int) ( $params['amount'] ?? 0 );
		$currency  = strtoupper( sanitize_text_field( (string) ( $params['currency'] ?? '' ) ) );

		$ids = get_posts(
			array(
				'post_type'      => self::POST_TYPE,
				'post_status'    => 'any',
				'posts_per_page' => 1,
				'fields'         => 'ids',
				'meta_key'       => '_mr_reference',
				'meta_value'     => $reference,
			)
		);
		if ( ! $reference || ! $ids ) {
			return new WP_Error( 'mr_booking_not_found', 'Booking not found.', array( 'status' => 404 ) );
		}
		$id     = $ids[0];
		$status = get_post_meta( $id, '_mr_status', true );

		if ( in_array( $status, array( 'confirmed', 'needs_attention', 'completed', 'refunded', 'cancelled' ), true ) ) {
			return self::summary( $id );
		}

		$problems = array();
		if ( $amount !== (int) get_post_meta( $id, '_mr_amount_kobo', true ) || self::CURRENCY !== $currency ) {
			$problems[] = sprintf( 'Amount paid (%s %s) does not match the price.', $currency, number_format( $amount / 100, 2 ) );
		}
		// A hold can lapse while the client is still paying — make sure nobody else took the slot.
		$start = (int) get_post_meta( $id, '_mr_start_ts', true );
		$end   = (int) get_post_meta( $id, '_mr_end_ts', true );
		if ( self::overlaps( $start, $end, self::busy_intervals( $id, false ) ) ) {
			$problems[] = 'The time slot was taken by another confirmed booking while this client was paying.';
		}

		$new_status = $problems ? 'needs_attention' : 'confirmed';
		update_post_meta( $id, '_mr_status', $new_status );
		update_post_meta( $id, '_mr_paid_at', self::when_label( ! empty( $params['paidAt'] ) && strtotime( $params['paidAt'] ) ? strtotime( $params['paidAt'] ) : time() ) );
		update_post_meta( $id, '_mr_transaction_id', sanitize_text_field( (string) ( $params['transactionId'] ?? '' ) ) );
		if ( $problems ) {
			update_post_meta( $id, '_mr_notes', 'PAYMENT RECEIVED — ACTION NEEDED: ' . implode( ' ', $problems ) );
		}

		self::send_emails( $id, $new_status, $problems );
		return self::summary( $id );
	}

	private static function summary( $id ) {
		$meta = function ( $key ) use ( $id ) {
			return get_post_meta( $id, '_mr_' . $key, true );
		};
		return array(
			'reference' => $meta( 'reference' ),
			'status'    => $meta( 'status' ),
			'title'     => $meta( 'title' ),
			'when'      => $meta( 'when' ),
			'start'     => gmdate( 'Y-m-d\TH:i:s\Z', (int) $meta( 'start_ts' ) ),
			'name'      => $meta( 'name' ),
			'email'     => $meta( 'email' ),
			'amount'    => $meta( 'amount' ),
		);
	}

	// ---------------------------------------------------------------------------
	// Emails (with a calendar invite attached)
	// ---------------------------------------------------------------------------

	private static function ics( $id ) {
		$meta  = function ( $key ) use ( $id ) {
			return get_post_meta( $id, '_mr_' . $key, true );
		};
		$esc   = function ( $text ) {
			return str_replace( array( '\\', ';', ',', "\n" ), array( '\\\\', '\;', '\,', '\n' ), (string) $text );
		};
		$stamp = function ( $ts ) {
			return gmdate( 'Ymd\THis\Z', (int) $ts );
		};
		$lines = array(
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			'PRODID:-//Manage & Resolve//Consultations//EN',
			'METHOD:PUBLISH',
			'BEGIN:VEVENT',
			'UID:' . $meta( 'reference' ) . '@manageandresolve.com',
			'DTSTAMP:' . $stamp( time() ),
			'DTSTART:' . $stamp( $meta( 'start_ts' ) ),
			'DTEND:' . $stamp( $meta( 'end_ts' ) ),
			'SUMMARY:' . $esc( $meta( 'title' ) . ' — ' . $meta( 'name' ) ),
			'DESCRIPTION:' . $esc( "Online consultation. Foluke's team will send the meeting link.\nReference: " . $meta( 'reference' ) ),
			'END:VEVENT',
			'END:VCALENDAR',
		);
		$file = trailingslashit( get_temp_dir() ) . 'consultation-' . sanitize_file_name( $meta( 'reference' ) ) . '.ics';
		file_put_contents( $file, implode( "\r\n", $lines ) . "\r\n" );
		return $file;
	}

	private static function send_emails( $id, $status, $problems ) {
		$meta   = function ( $key ) use ( $id ) {
			return get_post_meta( $id, '_mr_' . $key, true );
		};
		$invite = self::ics( $id );
		$team   = MR_Settings::notify_email( 'notify_bookings' );

		if ( 'confirmed' === $status ) {
			$client = array(
				'Dear ' . $meta( 'name' ) . ',',
				'',
				'Thank you — your consultation is confirmed.',
				'',
				$meta( 'title' ),
				$meta( 'when' ),
				'Amount paid: ' . $meta( 'amount' ),
				'Reference: ' . $meta( 'reference' ),
				'',
				"Foluke's team will contact you with the meeting link before the consultation. A calendar invite is attached.",
				'',
				'Manage & Resolve',
			);
			wp_mail( $meta( 'email' ), 'Your consultation is confirmed — ' . $meta( 'when' ), implode( "\n", $client ), array(), array( $invite ) );
		}

		$team_lines = array(
			$problems ? 'A consultation was PAID but needs attention:' : 'A new consultation has been booked and paid.',
			'',
		);
		foreach ( $problems as $problem ) {
			$team_lines[] = '⚠ ' . $problem;
		}
		if ( $problems ) {
			$team_lines[] = '';
		}
		foreach ( array( 'when', 'name', 'email', 'phone', 'company', 'amount', 'reference' ) as $key ) {
			if ( '' !== (string) $meta( $key ) ) {
				$team_lines[] = ucfirst( $key ) . ': ' . $meta( $key );
			}
		}
		$team_lines[] = '';
		$team_lines[] = $problems
			? 'Next step: resolve the issue above (refund, top-up or a new time) before sending a meeting link. The client has not been sent a confirmation.'
			: 'Next step: send the client the meeting link.';
		$team_lines[] = 'Open it: ' . admin_url( 'post.php?post=' . $id . '&action=edit' );

		wp_mail(
			$team,
			( $problems ? 'ACTION NEEDED — ' : 'New consultation: ' ) . $meta( 'name' ) . ', ' . $meta( 'when' ),
			implode( "\n", $team_lines ),
			array( 'Reply-To: ' . $meta( 'email' ) ),
			array( $invite )
		);

		wp_delete_file( $invite );
	}

	// ---------------------------------------------------------------------------
	// Housekeeping — unpaid holds become "Expired (unpaid)"
	// ---------------------------------------------------------------------------

	public static function schedule_cleanup() {
		if ( ! wp_next_scheduled( self::CRON_HOOK ) ) {
			wp_schedule_event( time() + HOUR_IN_SECONDS, 'hourly', self::CRON_HOOK );
		}
	}

	public static function expire_holds() {
		$ids = get_posts(
			array(
				'post_type'      => self::POST_TYPE,
				'post_status'    => 'any',
				'posts_per_page' => 200,
				'fields'         => 'ids',
				'meta_query'     => array(
					array(
						'key'   => '_mr_status',
						'value' => 'pending_payment',
					),
					array(
						'key'     => '_mr_hold_expires',
						'value'   => time() - HOUR_IN_SECONDS, // grace period for slow payments
						'compare' => '<',
						'type'    => 'NUMERIC',
					),
				),
			)
		);
		foreach ( $ids as $id ) {
			update_post_meta( $id, '_mr_status', 'expired' );
		}
	}

	// ---------------------------------------------------------------------------
	// Admin — Settings and Calendar
	// ---------------------------------------------------------------------------

	public static function admin_pages() {
		$parent = 'edit.php?post_type=' . self::POST_TYPE;
		add_submenu_page( $parent, 'Consultation calendar', 'Calendar', 'edit_others_mr_entries', 'mr-booking-calendar', array( __CLASS__, 'render_calendar' ) );
		add_submenu_page( $parent, 'Consultation settings', 'Settings', 'manage_options', 'mr-booking-settings', array( __CLASS__, 'render_settings' ) );
	}

	public static function render_settings() {
		$settings = self::settings();
		$days     = array( 1 => 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' );
		?>
		<div class="wrap">
			<h1>Consultation settings</h1>
			<?php if ( isset( $_GET['saved'] ) ) : ?>
				<div class="notice notice-success is-dismissible"><p>Settings saved.</p></div>
			<?php endif; ?>
			<?php if ( ! self::is_open() ) : ?>
				<div class="notice notice-warning"><p>Online booking is <strong>closed</strong> on the website until it is switched on and a price is set.</p></div>
			<?php endif; ?>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="mr_save_booking_settings" />
				<?php wp_nonce_field( 'mr_save_booking_settings' ); ?>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row">Online booking</th>
						<td><label><input type="checkbox" name="enabled" value="1" <?php checked( $settings['enabled'] ); ?> /> Open for bookings on the website</label></td>
					</tr>
					<tr>
						<th scope="row"><label for="mr-title">Consultation name</label></th>
						<td><input id="mr-title" name="title" type="text" class="regular-text" value="<?php echo esc_attr( $settings['title'] ); ?>" /></td>
					</tr>
					<tr>
						<th scope="row"><label for="mr-description">Short description</label></th>
						<td><textarea id="mr-description" name="description" rows="3" class="large-text"><?php echo esc_textarea( $settings['description'] ); ?></textarea><p class="description">Shown on the booking page. Optional.</p></td>
					</tr>
					<tr>
						<th scope="row"><label for="mr-price">Price (₦)</label></th>
						<td><input id="mr-price" name="price" type="number" min="0" step="100" value="<?php echo esc_attr( $settings['price'] ); ?>" /> <span class="description">Naira, whole amount — e.g. 50000.</span></td>
					</tr>
					<tr>
						<th scope="row"><label for="mr-duration">Length (minutes)</label></th>
						<td><input id="mr-duration" name="duration" type="number" min="15" step="5" value="<?php echo esc_attr( $settings['duration'] ); ?>" /></td>
					</tr>
					<tr>
						<th scope="row">Weekly hours (Lagos time)</th>
						<td>
							<table>
								<?php foreach ( $days as $number => $label ) : $hours = $settings['hours'][ $number ]; ?>
									<tr>
										<td style="padding:4px 12px 4px 0"><label><input type="checkbox" name="hours[<?php echo (int) $number; ?>][on]" value="1" <?php checked( $hours['on'] ); ?> /> <?php echo esc_html( $label ); ?></label></td>
										<td style="padding:4px 0"><input type="time" name="hours[<?php echo (int) $number; ?>][start]" value="<?php echo esc_attr( $hours['start'] ); ?>" /> to <input type="time" name="hours[<?php echo (int) $number; ?>][end]" value="<?php echo esc_attr( $hours['end'] ); ?>" /></td>
									</tr>
								<?php endforeach; ?>
							</table>
							<p class="description">The last consultation of the day must finish by the closing time.</p>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="mr-buffer">Gap between consultations (minutes)</label></th>
						<td><input id="mr-buffer" name="buffer" type="number" min="0" step="5" value="<?php echo esc_attr( $settings['buffer'] ); ?>" /></td>
					</tr>
					<tr>
						<th scope="row"><label for="mr-notice">Minimum notice (hours)</label></th>
						<td><input id="mr-notice" name="notice_hours" type="number" min="0" value="<?php echo esc_attr( $settings['notice_hours'] ); ?>" /> <span class="description">How soon the earliest bookable slot can be.</span></td>
					</tr>
					<tr>
						<th scope="row"><label for="mr-window">Book up to (days ahead)</label></th>
						<td><input id="mr-window" name="window_days" type="number" min="1" max="90" value="<?php echo esc_attr( $settings['window_days'] ); ?>" /></td>
					</tr>
					<tr>
						<th scope="row"><label for="mr-hold">Hold a slot while paying (minutes)</label></th>
						<td><input id="mr-hold" name="hold_minutes" type="number" min="5" max="60" value="<?php echo esc_attr( $settings['hold_minutes'] ); ?>" /></td>
					</tr>
					<tr>
						<th scope="row"><label for="mr-blocked">Unavailable dates</label></th>
						<td><textarea id="mr-blocked" name="blocked" rows="5" class="large-text code" placeholder="2026-12-24 to 2027-01-02&#10;2026-10-01"><?php echo esc_textarea( $settings['blocked'] ); ?></textarea><p class="description">One per line: a date (2026-10-01) or a range (2026-12-24 to 2027-01-02). Holidays, travel, court days.</p></td>
					</tr>
				</table>
				<?php submit_button( 'Save settings' ); ?>
			</form>
		</div>
		<?php
	}

	public static function save_settings() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'You are not allowed to change these settings.', 403 );
		}
		check_admin_referer( 'mr_save_booking_settings' );

		$input    = wp_unslash( $_POST );
		$defaults = self::defaults();
		$time     = function ( $value, $fallback ) {
			return preg_match( '/^\d{2}:\d{2}$/', (string) $value ) ? $value : $fallback;
		};

		$hours = array();
		foreach ( $defaults['hours'] as $day => $default ) {
			$row           = $input['hours'][ $day ] ?? array();
			$hours[ $day ] = array(
				'on'    => empty( $row['on'] ) ? 0 : 1,
				'start' => $time( $row['start'] ?? '', $default['start'] ),
				'end'   => $time( $row['end'] ?? '', $default['end'] ),
			);
		}

		update_option(
			self::OPTION,
			array(
				'enabled'      => empty( $input['enabled'] ) ? 0 : 1,
				'title'        => sanitize_text_field( $input['title'] ?? $defaults['title'] ),
				'description'  => sanitize_textarea_field( $input['description'] ?? '' ),
				'price'        => max( 0, absint( $input['price'] ?? 0 ) ),
				'duration'     => max( 15, absint( $input['duration'] ?? 60 ) ),
				'buffer'       => absint( $input['buffer'] ?? 15 ),
				'notice_hours' => absint( $input['notice_hours'] ?? 24 ),
				'window_days'  => min( 90, max( 1, absint( $input['window_days'] ?? 30 ) ) ),
				'hold_minutes' => min( 60, max( 5, absint( $input['hold_minutes'] ?? 15 ) ) ),
				'hours'        => $hours,
				'blocked'      => sanitize_textarea_field( $input['blocked'] ?? '' ),
			)
		);

		wp_safe_redirect( admin_url( 'edit.php?post_type=' . self::POST_TYPE . '&page=mr-booking-settings&saved=1' ) );
		exit;
	}

	public static function render_calendar() {
		$tz    = self::tz();
		$month = isset( $_GET['month'] ) && preg_match( '/^\d{4}-\d{2}$/', sanitize_text_field( wp_unslash( $_GET['month'] ) ) )
			? DateTimeImmutable::createFromFormat( '!Y-m', sanitize_text_field( wp_unslash( $_GET['month'] ) ), $tz )
			: new DateTimeImmutable( 'first day of this month midnight', $tz );
		$next  = $month->modify( '+1 month' );
		$prev  = $month->modify( '-1 month' );

		$ids = get_posts(
			array(
				'post_type'      => self::POST_TYPE,
				'post_status'    => 'any',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'meta_query'     => array(
					array(
						'key'     => '_mr_start_ts',
						'value'   => array( $month->getTimestamp(), $next->getTimestamp() - 1 ),
						'compare' => 'BETWEEN',
						'type'    => 'NUMERIC',
					),
				),
			)
		);

		$by_day = array();
		foreach ( $ids as $id ) {
			$status = get_post_meta( $id, '_mr_status', true );
			if ( in_array( $status, array( 'expired', 'cancelled', 'refunded' ), true ) ) {
				continue;
			}
			$start                              = (int) get_post_meta( $id, '_mr_start_ts', true );
			$local                              = ( new DateTimeImmutable( '@' . $start ) )->setTimezone( $tz );
			$by_day[ $local->format( 'Y-m-d' ) ][] = array( $start, $local->format( 'g:i a' ), get_post_meta( $id, '_mr_name', true ), $status, $id );
		}

		$base   = admin_url( 'edit.php?post_type=' . self::POST_TYPE . '&page=mr-booking-calendar' );
		$colors = array(
			'confirmed'       => '#1e7e34',
			'completed'       => '#555',
			'needs_attention' => '#b32d2e',
			'pending_payment' => '#996800',
		);
		?>
		<div class="wrap">
			<h1>Consultation calendar — <?php echo esc_html( $month->format( 'F Y' ) ); ?></h1>
			<p>
				<a class="button" href="<?php echo esc_url( add_query_arg( 'month', $prev->format( 'Y-m' ), $base ) ); ?>">&larr; <?php echo esc_html( $prev->format( 'F' ) ); ?></a>
				<a class="button" href="<?php echo esc_url( $base ); ?>">This month</a>
				<a class="button" href="<?php echo esc_url( add_query_arg( 'month', $next->format( 'Y-m' ), $base ) ); ?>"><?php echo esc_html( $next->format( 'F' ) ); ?> &rarr;</a>
				<span style="margin-left:12px;color:#646970">Times are Lagos time (WAT). <span style="color:#1e7e34">■</span> confirmed <span style="color:#996800">■</span> awaiting payment <span style="color:#b32d2e">■</span> needs attention</span>
			</p>
			<table class="widefat fixed" style="table-layout:fixed">
				<thead><tr><?php foreach ( array( 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ) as $label ) : ?><th><?php echo esc_html( $label ); ?></th><?php endforeach; ?></tr></thead>
				<tbody>
				<?php
				$cursor = $month->modify( '-' . ( (int) $month->format( 'N' ) - 1 ) . ' days' );
				$today  = ( new DateTimeImmutable( 'now', $tz ) )->format( 'Y-m-d' );
				while ( $cursor < $next ) {
					echo '<tr>';
					for ( $i = 0; $i < 7; $i++, $cursor = $cursor->modify( '+1 day' ) ) {
						$key     = $cursor->format( 'Y-m-d' );
						$outside = $cursor->format( 'm' ) !== $month->format( 'm' );
						printf(
							'<td style="vertical-align:top;height:96px;%s%s"><strong>%d</strong>',
							$outside ? 'background:#f6f7f7;color:#a7aaad;' : '',
							$key === $today ? 'box-shadow:inset 0 0 0 2px #2271b1;' : '',
							(int) $cursor->format( 'j' )
						);
						$entries = $by_day[ $key ] ?? array();
						usort(
							$entries,
							function ( $a, $b ) {
								return $a[0] <=> $b[0];
							}
						);
						foreach ( $entries as $entry ) {
							printf(
								'<div style="margin-top:4px;padding:3px 6px;border-left:3px solid %s;background:#fff;font-size:12px"><a href="%s">%s — %s</a></div>',
								esc_attr( $colors[ $entry[3] ] ?? '#555' ),
								esc_url( admin_url( 'post.php?post=' . $entry[4] . '&action=edit' ) ),
								esc_html( $entry[1] ),
								esc_html( $entry[2] )
							);
						}
						echo '</td>';
					}
					echo '</tr>';
				}
				?>
				</tbody>
			</table>
		</div>
		<?php
	}
}
