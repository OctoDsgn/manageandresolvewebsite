<?php
/**
 * Settings → Manage & Resolve: the website connection, notification emails, and a live
 * setup checklist. Every value can also be pinned in wp-config.php with a constant
 * (MR_SITE_URL, MR_REVALIDATE_SECRET, MR_NOTIFY_DISPUTES, MR_NOTIFY_ENQUIRIES,
 * MR_NOTIFY_BOOKINGS) — a constant always wins over the saved setting.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class MR_Settings {

	const OPTION = 'mr_site_settings';
	const PAGE   = 'mr-website-settings';

	/** Setting key => [label, wp-config constant]. */
	const FIELDS = array(
		'site_url'          => array( 'Website address', 'MR_SITE_URL' ),
		'revalidate_secret' => array( 'Refresh secret', 'MR_REVALIDATE_SECRET' ),
		'notify_disputes'   => array( 'Email new disputes to', 'MR_NOTIFY_DISPUTES' ),
		'notify_enquiries'  => array( 'Email new enquiries & training enquiries to', 'MR_NOTIFY_ENQUIRIES' ),
		'notify_bookings'   => array( 'Email new consultation bookings to', 'MR_NOTIFY_BOOKINGS' ),
	);

	public static function init() {
		if ( is_admin() ) {
			add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
			add_action( 'admin_post_mr_save_site_settings', array( __CLASS__, 'save' ) );
			add_filter( 'plugin_action_links_' . plugin_basename( dirname( __DIR__ ) . '/mr-submissions.php' ), array( __CLASS__, 'plugin_link' ) );
		}
	}

	public static function get( $key ) {
		$constant = self::FIELDS[ $key ][1];
		if ( defined( $constant ) && constant( $constant ) ) {
			return (string) constant( $constant );
		}
		$saved = get_option( self::OPTION, array() );
		return isset( $saved[ $key ] ) ? (string) $saved[ $key ] : '';
	}

	/** Notification address for a given setting key, falling back to the site admin email. */
	public static function notify_email( $key ) {
		$email = self::get( $key );
		return is_email( $email ) ? $email : get_option( 'admin_email' );
	}

	public static function menu() {
		add_options_page( 'Manage & Resolve website', 'Manage & Resolve', 'manage_options', self::PAGE, array( __CLASS__, 'render' ) );
	}

	public static function plugin_link( $links ) {
		array_unshift( $links, '<a href="' . esc_url( admin_url( 'options-general.php?page=' . self::PAGE ) ) . '">Settings &amp; checklist</a>' );
		return $links;
	}

	public static function save() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'You are not allowed to change these settings.', 403 );
		}
		check_admin_referer( 'mr_save_site_settings' );

		$input = wp_unslash( $_POST );
		update_option(
			self::OPTION,
			array(
				'site_url'          => untrailingslashit( esc_url_raw( trim( $input['site_url'] ?? '' ) ) ),
				'revalidate_secret' => sanitize_text_field( $input['revalidate_secret'] ?? '' ),
				'notify_disputes'   => sanitize_email( $input['notify_disputes'] ?? '' ),
				'notify_enquiries'  => sanitize_email( $input['notify_enquiries'] ?? '' ),
				'notify_bookings'   => sanitize_email( $input['notify_bookings'] ?? '' ),
			)
		);
		wp_safe_redirect( admin_url( 'options-general.php?page=' . self::PAGE . '&saved=1' ) );
		exit;
	}

	/** Each check: [done?, label, how to fix]. */
	private static function checklist() {
		$api_user  = get_users(
			array(
				'role'   => MR_Submissions::SUBMITTER_ROLE,
				'number' => 1,
			)
		);
		$app_pass  = $api_user && class_exists( 'WP_Application_Passwords' ) && WP_Application_Passwords::get_user_application_passwords( $api_user[0]->ID );
		$timezone  = get_option( 'timezone_string' );
		$acf_group = function_exists( 'acf_get_field_group' ) ? acf_get_field_group( 'group_mr_blog_article_details' ) : false;

		return array(
			array( is_ssl() || 0 === strpos( home_url(), 'https://' ), 'WordPress runs on HTTPS', 'Ask your host to switch on a free SSL certificate, then set the addresses in Settings → General to https://.' ),
			array( '' !== (string) get_option( 'permalink_structure' ), 'Pretty permalinks are on', 'Settings → Permalinks → choose "Post name" → Save.' ),
			array( 'Africa/Lagos' === $timezone, 'Timezone is Lagos', 'Settings → General → Timezone → choose "Lagos" → Save.' ),
			array( function_exists( 'acf_get_field_group' ), 'Advanced Custom Fields is installed', 'Plugins → Add New → search "Advanced Custom Fields" → Install → Activate.' ),
			array( ! empty( $acf_group ), 'Blog article fields are imported', 'ACF → Tools → Import Field Groups → choose blog-article-details.json → Import.' ),
			array( ! empty( $api_user ), 'A "Website forms (API only)" user exists', 'Users → Add New → role "Website forms (API only)".' ),
			array( ! empty( $app_pass ), 'That user has an Application Password', 'Users → edit that user → Application Passwords → Add New. Copy it into Vercel.' ),
			array( '' !== self::get( 'site_url' ), 'Website address is set', 'Fill in "Website address" below.' ),
			array( '' !== self::get( 'revalidate_secret' ), 'Refresh secret is set', 'Fill in "Refresh secret" below (same value as WORDPRESS_REVALIDATE_SECRET in Vercel).' ),
			array( class_exists( 'MR_Bookings' ) && MR_Bookings::is_open(), 'Consultation booking is open', 'Consultations → Settings → set a price, tick "Open for bookings" → Save. (Optional until you are ready.)' ),
		);
	}

	public static function render() {
		$suggested = wp_generate_password( 40, false, false );
		$checks    = self::checklist();
		$done      = count( array_filter( array_column( $checks, 0 ) ) );
		?>
		<div class="wrap">
			<h1>Manage &amp; Resolve website</h1>
			<?php if ( isset( $_GET['saved'] ) ) : ?>
				<div class="notice notice-success is-dismissible"><p>Settings saved.</p></div>
			<?php endif; ?>

			<h2>Setup checklist — <?php echo (int) $done; ?> of <?php echo count( $checks ); ?> done</h2>
			<table class="widefat striped" style="max-width:900px">
				<tbody>
				<?php foreach ( $checks as $check ) : ?>
					<tr>
						<td style="width:28px;font-size:18px;color:<?php echo $check[0] ? '#1e7e34' : '#b32d2e'; ?>"><?php echo $check[0] ? '✓' : '✗'; ?></td>
						<td><strong><?php echo esc_html( $check[1] ); ?></strong><?php if ( ! $check[0] ) : ?><br /><span style="color:#646970"><?php echo esc_html( $check[2] ); ?></span><?php endif; ?></td>
					</tr>
				<?php endforeach; ?>
				</tbody>
			</table>

			<h2 style="margin-top:2em">Website connection &amp; notifications</h2>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="mr_save_site_settings" />
				<?php wp_nonce_field( 'mr_save_site_settings' ); ?>
				<table class="form-table" role="presentation">
					<?php
					$help = array(
						'site_url'          => 'The live website, e.g. https://www.manageandresolve.com — WordPress tells it to refresh when you publish.',
						'revalidate_secret' => 'A long random password shared with the website. Paste the same value into Vercel as WORDPRESS_REVALIDATE_SECRET. Suggestion: <code>' . esc_html( $suggested ) . '</code>',
						'notify_disputes'   => 'Leave empty to use the site admin email.',
						'notify_enquiries'  => 'Leave empty to use the site admin email.',
						'notify_bookings'   => 'Leave empty to use the site admin email.',
					);
					foreach ( self::FIELDS as $key => $field ) :
						$locked = defined( $field[1] ) && constant( $field[1] );
						$type   = 'site_url' === $key ? 'url' : ( 0 === strpos( $key, 'notify_' ) ? 'email' : 'text' );
						?>
						<tr>
							<th scope="row"><label for="mr-<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $field[0] ); ?></label></th>
							<td>
								<input id="mr-<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( $key ); ?>" type="<?php echo esc_attr( $type ); ?>" class="regular-text" value="<?php echo esc_attr( self::get( $key ) ); ?>" <?php disabled( $locked ); ?> />
								<p class="description"><?php echo $locked ? 'Set in wp-config.php (' . esc_html( $field[1] ) . ').' : wp_kses( $help[ $key ], array( 'code' => array() ) ); ?></p>
							</td>
						</tr>
					<?php endforeach; ?>
				</table>
				<?php submit_button( 'Save settings' ); ?>
			</form>
		</div>
		<?php
	}
}
