// Contact form. GitHub Pages can't process forms, so when the form has a
// Formspree action (data-formspree) it's sent there with fetch and the result
// is shown inline. Otherwise it opens the visitor's email app with the
// message filled in.
(function () {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');
    const email = form.dataset.email;

    function setStatus(state, text) {
        status.dataset.state = state;
        status.textContent = text;
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const data = new FormData(form);

        if (!form.hasAttribute('data-formspree')) {
            const body = data.get('message') + '\n\n— ' + data.get('name') + ' (' + data.get('email') + ')';
            window.location.href = 'mailto:' + email +
                '?subject=' + encodeURIComponent(data.get('subject')) +
                '&body=' + encodeURIComponent(body);
            return;
        }

        button.disabled = true;
        setStatus('pending', 'Sending…');

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { Accept: 'application/json' }
            });
            if (!response.ok) throw new Error('Formspree responded ' + response.status);
            form.reset();
            setStatus('success', "Thanks! Your message is on its way, and I'll reply soon.");
        } catch (error) {
            setStatus('error', 'Something went wrong. Please email me directly at ' + email + '.');
        } finally {
            button.disabled = false;
        }
    });
})();
