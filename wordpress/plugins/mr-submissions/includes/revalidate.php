<?php
/**
 * Tells the website to refresh its cached blog content the moment a post is published,
 * updated, unpublished or deleted. Uses Settings → Manage & Resolve (website address and
 * refresh secret). Without it, the website still picks up changes within 5 minutes.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class MR_Revalidate {

	public static function init() {
		add_action( 'wp_after_insert_post', array( __CLASS__, 'after_save' ), 10, 4 );
		// ACF fields are saved in a separate request by the block editor — refresh again once stored.
		add_action( 'acf/save_post', array( __CLASS__, 'after_acf_save' ), 20 );
		add_action( 'deleted_post', array( __CLASS__, 'after_delete' ), 10, 2 );
	}

	public static function ping() {
		$site   = MR_Settings::get( 'site_url' );
		$secret = MR_Settings::get( 'revalidate_secret' );
		if ( ! $site || ! $secret ) {
			return;
		}
		// Non-blocking: editors never wait on the website.
		wp_remote_post(
			untrailingslashit( $site ) . '/api/revalidate',
			array(
				'headers'  => array( 'x-revalidate-secret' => $secret ),
				'timeout'  => 5,
				'blocking' => false,
			)
		);
	}

	private static function is_blog_post( $post ) {
		$post = get_post( $post );
		return $post && 'post' === $post->post_type && ! wp_is_post_revision( $post ) && ! wp_is_post_autosave( $post );
	}

	public static function after_save( $post_id, $post, $update, $post_before ) {
		$was_public = $post_before && 'publish' === $post_before->post_status;
		if ( self::is_blog_post( $post ) && ( 'publish' === $post->post_status || $was_public ) ) {
			self::ping();
		}
	}

	public static function after_acf_save( $post_id ) {
		if ( is_numeric( $post_id ) && self::is_blog_post( $post_id ) && 'publish' === get_post_status( $post_id ) ) {
			self::ping();
		}
	}

	public static function after_delete( $post_id, $post ) {
		if ( $post && 'post' === $post->post_type ) {
			self::ping();
		}
	}
}
