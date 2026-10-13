# Quran Verse Bookmarks

A small WordPress plugin, built for a client's Quran study site, that lets readers bookmark verses without logging in. Bookmarks are stored in the browser's `localStorage`, so there's no account, no database table and no server round-trip.

## What it does

- Adds a bookmark button next to each verse heading. On a **single verse** page there is one button; on a **sura** page, which lists every verse in the chapter, each verse gets its own button.
- Clicking a button **toggles** the bookmark. The button's `bookmarked` class and `aria-pressed` state reflect whether that verse is saved, and are restored from storage on every page load.
- Renders the saved list (`sura:verse` links) into any element with the class `.bookmarked-pages`, and wires a `.clear-bookmarks` control to clear all of them.
- Rewrites the breadcrumb's 6-digit verse slug (`105001`) into readable `105:1` form.

## How it's put together

| File | Role |
| --- | --- |
| `gfd-bookmark.php` | Plugin header; enqueues the CSS and JS on the front end only (not inside the Bricks builder). |
| `includes/gfdb-functions.php` | Prints a single button template in the footer. |
| `js/gfdb-main.js` | Moves or clones that template into place, handles clicks, reads and writes `localStorage`, and keeps every button's visual state in sync. |
| `css/gfdb-main.css` | Positions the button beside the heading and styles the saved and unsaved states. |

The PHP side outputs one template, and the JS works out where the button goes. That way the plugin doesn't need to hook into the theme's verse loop, which was built in a page builder.

## What I wrote

All of it: the PHP, JS and CSS. jQuery is the only dependency, and WordPress already ships it.

## Trade-offs

- **`localStorage` instead of user accounts.** Readers can bookmark with zero friction, and the plugin stores no personal data. The cost is that bookmarks are tied to one browser on one device and disappear if site data is cleared. Each write re-reads storage first, so a second open tab isn't overwritten with stale data.
- **Selectors are tied to the page-builder markup.** The script locates verse URLs and numbers through Bricks element IDs and `data-field-id` attributes. That was the reliable hook on this site, but a template rebuild in the builder would need the selectors updated. A theme with its own templates would print `data-` attributes on each verse and remove that coupling.
- **Page type is detected from the URL** (`/verse` vs `/suras`). That's simple and matched the site's permalink structure, but it assumes those paths never change.
- **Bookmarks are keyed by full URL**, so the same verse reached through a different query string would count as a separate bookmark.

## Changes for this public copy

Compared with the version deployed on the client site:

- Removed a stray `sleep(2)` in the button output hook that delayed every page load. The button also now prints in `wp_footer` instead of `wp_head`.
- The saved-bookmarks list is now built with jQuery element constructors instead of an HTML string, so a tampered `localStorage` value can't inject markup.
- The button is now a real `<button>` with `aria-pressed`, and the saved-state styles that lived in the page builder's CSS are now in `gfdb-main.css`.
- Fixed the stylesheet enqueue arguments, depend on WordPress's own `jquery` handle, and removed an unused admin page stub.
