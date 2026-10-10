// Click-to-play for the Get Otter Here! itch.io embed. The game downloads
// about 25 MB, so the iframe is only created when a visitor asks for it.
// Without JavaScript the launcher is a plain link to the itch.io page.
(function () {
    const launcher = document.querySelector('.play-launcher[data-embed-src]');
    if (!launcher) return;

    launcher.addEventListener('click', function (event) {
        event.preventDefault();
        const iframe = document.createElement('iframe');
        iframe.src = launcher.dataset.embedSrc;
        iframe.title = launcher.dataset.embedTitle;
        iframe.width = launcher.dataset.embedWidth;
        iframe.height = launcher.dataset.embedHeight;
        iframe.allowFullscreen = true;
        launcher.replaceWith(iframe);
        iframe.focus();
    });
})();
