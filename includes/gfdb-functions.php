<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Skip front-end output inside the Bricks visual builder.
function gfdb_is_builder() {
    return function_exists( 'bricks_is_builder_main' ) && bricks_is_builder_main();
}

// One button template per page; gfdb-main.js moves or clones it into place.
add_action( 'wp_footer', 'jos_bookmark' );

function jos_bookmark() {
    if ( gfdb_is_builder() ) {
        return;
    }
    ?>
    <div id="jos-bookmark">
        <button type="button" class="josb-btn" aria-label="Bookmark this verse" aria-pressed="false"></button>
    </div>
    <?php
}
