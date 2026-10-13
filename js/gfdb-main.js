(function($) {
    const STORAGE_KEY = 'bookmarkedPages';

    const isVersePage = () => window.location.href.indexOf('/verse') > -1;
    const isSuraPage  = () => window.location.href.indexOf('/suras') > -1;

    function readBookmarks(key) {
        return JSON.parse(localStorage.getItem(key || STORAGE_KEY)) || [];
    }

    function setButtonState($button, isBookmarked) {
        $button.toggleClass('bookmarked', isBookmarked).attr('aria-pressed', String(isBookmarked));
    }

    function josBookmark() {
        // Exposed globally so the "clear bookmarks" control can resync the buttons.
        window.updateBookmarkButtonStates = function() {
            const bookmarkedUrls = readBookmarks().map(bookmark => bookmark.url);

            if (isVersePage()) {
                setButtonState($('.josb-btn'), bookmarkedUrls.includes(window.location.href));
            } else if (isSuraPage()) {
                // A sura page lists many verses, each with its own button.
                $('.bricks-layout-inner').each(function() {
                    const $container = $(this);
                    const verseUrl = $container.find('[data-field-id="ynifyw"] a').attr('href');
                    setButtonState($container.find('.josb-btn'), !!verseUrl && bookmarkedUrls.includes(verseUrl));
                });
            }
        };

        $.fn.josBookmark = function (options) {
            const settings = $.extend({
                storageKey: STORAGE_KEY,
                displaySelector: '.bookmarked-pages' // where the saved-bookmarks list renders
            }, options);

            // Toggle: remove the bookmark if it exists, otherwise add it.
            // Always re-read storage so another open tab's changes aren't overwritten.
            const toggleBookmark = (url, snum, vnum) => {
                const bookmarks = readBookmarks(settings.storageKey);
                const existingIndex = bookmarks.findIndex(bookmark => bookmark.url === url);

                if (existingIndex !== -1) {
                    bookmarks.splice(existingIndex, 1);
                } else {
                    bookmarks.push({ url, snum, vnum });
                }

                localStorage.setItem(settings.storageKey, JSON.stringify(bookmarks));
                displayBookmarks();
                window.updateBookmarkButtonStates();
            };

            const displayBookmarks = () => {
                const $displayArea = $(settings.displaySelector).empty();

                readBookmarks(settings.storageKey).forEach(bookmark => {
                    const $link = $('<a>', {
                        href: bookmark.url,
                        target: '_blank',
                        rel: 'noopener',
                        text: `${bookmark.snum}:${bookmark.vnum}`
                    });
                    $displayArea.append($('<div>').append('-', $link));
                });
            };

            if (isVersePage()) {
                this.on('click', function () {
                    const suraNum  = $('#brxe-nnjnqg').text().replace(/sura\s*/i, '').trim();
                    const verseNum = $('#brxe-fyyxcp').text().replace(/verse\s*/i, '').trim();
                    toggleBookmark(window.location.href, suraNum, verseNum);
                });
            } else if (isSuraPage()) {
                // Each button reads its data from its own verse container.
                this.on('click', function () {
                    const $verseContainer = $(this).closest('.bricks-layout-inner');
                    const vUrl = $verseContainer.find('[data-field-id="ynifyw"] a').attr('href');
                    const sNum = $verseContainer.find('[data-field-id="feffyv"]').text();
                    const vNum = $verseContainer.find('[data-field-id="gizaqb"] a').text();

                    if (vUrl && sNum && vNum) {
                        toggleBookmark(vUrl, sNum, vNum);
                    } else {
                        console.error('Could not extract bookmark data:', { vUrl, sNum, vNum });
                    }
                });
            }

            displayBookmarks();
            window.updateBookmarkButtonStates();

            return this;
        };

        $('.josb-btn').josBookmark();
    }

    // The plugin prints one button template; place it next to each verse heading.
    function josBookmarkIcon() {
        const $bMark = $('#jos-bookmark').detach();

        if (isVersePage()) {
            $('.verse-sub').append($bMark);
        } else if (isSuraPage()) {
            $('.bricks-layout-inner').each(function() {
                $(this).append($bMark.clone());
            });
        }
    }

    function clearBookmarks() {
        $('.clear-bookmarks').on('click', function() {
            localStorage.removeItem(STORAGE_KEY);
            $('.bookmarked-pages').empty();
            window.updateBookmarkButtonStates();
        });
    }

    // Verse slugs are 6-digit "SSSVVV" IDs (e.g. "105001"); show them as "105:1".
    function formatBreadcrumb() {
        const $breadcrumbItem = $('span.item[aria-current="page"]');
        const match = $breadcrumbItem.text().trim().match(/^(\d{3})(\d{3})$/);

        if (match) {
            $breadcrumbItem.text(`${parseInt(match[1], 10)}:${parseInt(match[2], 10)}`);
        }
    }

    $(function() {
        josBookmarkIcon();
        josBookmark();
        clearBookmarks();
        formatBreadcrumb();
    });
})(jQuery);
