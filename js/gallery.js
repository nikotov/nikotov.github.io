// Opens gallery photos in the <dialog> lightbox, with previous/next buttons
// and arrow keys. Without JavaScript (or <dialog> support) each photo is
// still a plain link to its large version.
(function () {
    const dialog = document.getElementById('lightbox');
    const links = Array.from(document.querySelectorAll('[data-lightbox]'));
    if (!dialog || !links.length || typeof dialog.showModal !== 'function') return;

    const image = dialog.querySelector('img');
    const caption = dialog.querySelector('figcaption');
    let index = 0;
    let opener = null;

    function show(i) {
        index = (i + links.length) % links.length;
        const link = links[index];
        image.src = link.href;
        image.alt = link.querySelector('img').alt;
        image.width = link.dataset.width;
        image.height = link.dataset.height;
        caption.textContent = link.dataset.caption;
    }

    links.forEach(function (link, i) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            opener = link;
            show(i);
            dialog.showModal();
        });
    });

    dialog.querySelector('[data-close]').addEventListener('click', function () { dialog.close(); });
    dialog.querySelector('[data-prev]').addEventListener('click', function () { show(index - 1); });
    dialog.querySelector('[data-next]').addEventListener('click', function () { show(index + 1); });

    dialog.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') show(index - 1);
        if (event.key === 'ArrowRight') show(index + 1);
    });

    // A click on the dark area around the photo closes the viewer
    dialog.addEventListener('click', function (event) {
        if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener('close', function () {
        image.removeAttribute('src');
        if (opener) opener.focus();
    });
})();
