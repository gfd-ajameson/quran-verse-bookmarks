<?php
/*
Plugin Name: GFD Bookmark
Plugin URI: https://greyfoxdigital.com
Description: Lets readers bookmark verses. Bookmarks are stored in the browser's localStorage.
Author: Andrew Jameson - Grey Fox Digital
Version: 1.0.3
*/

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require_once plugin_dir_path( __FILE__ ) . 'includes/gfdb-functions.php';

add_action( 'wp_enqueue_scripts', 'gfdb_init' );

function gfdb_init() {
    if ( gfdb_is_builder() ) {
        return;
    }

    wp_enqueue_style(
        'bookmark-style',
        plugins_url( 'css/gfdb-main.css', __FILE__ ),
        array(),
        '1.0.3'
    );

    wp_enqueue_script(
        'bookmark-script',
        plugins_url( 'js/gfdb-main.js', __FILE__ ),
        array( 'jquery' ),
        '1.0.3',
        array(
            'in_footer' => true,
            'strategy'  => 'defer',
        )
    );
}
