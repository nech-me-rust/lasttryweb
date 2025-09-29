document.addEventListener('DOMContentLoaded', function () {
    // Bezpečná inicializace EmailJS (v4)
    if (window.emailjs && typeof emailjs.init === 'function') {
        try {
            emailjs.init({ publicKey: "I5YP3u4sQzRLRFTYj" });
        } catch (e) {
            console.error('EmailJS init error:', e);
        }
    } else {
        console.error('EmailJS knihovna nebyla načtena.');
    }

    // Exponujeme funkce pro tlačítka v HTML
    window.openRegistrationModal = function (eventName, eventDate) {
        const modal = document.getElementById('registrationModal');
        const eventDetails = document.getElementById('eventDetails');
        eventDetails.textContent = `${eventName} - ${eventDate}`;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };

    window.closeRegistrationModal = function () {
        const modal = document.getElementById('registrationModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        const form = document.getElementById('registrationForm');
        if (form) form.reset();
        document.getElementById('successMessage').style.display = 'none';
        document.getElementById('registrationForm').style.display = 'block';
    };

    function showToast(message, type = 'success') {
        const toast = document.getElementById('confirmationToast');
        const textEl = toast.querySelector('span');
        textEl.textContent = message;
        toast.classList.remove('error', 'success');
        toast.classList.add(type === 'error' ? 'error' : 'success');
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Odeslání formuláře
    const form = document.getElementById('registrationForm');
    const submitRegistrationBtn = document.getElementById('submitRegistrationBtn');

    if (submitRegistrationBtn) {
        submitRegistrationBtn.addEventListener('click', async function (e) {
            e.preventDefault(); // Prevent default form submission

            const submitBtn = this; // 'this' refers to the button
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');

            // Loading stav
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-block';
            submitBtn.disabled = true;

            const templateParams = {
                from_name: document.getElementById('name').value.trim(),
                from_email: document.getElementById('email').value.trim(),
                message: (document.getElementById('message').value || 'Bez zprávy').trim(),
                event_name: document.getElementById('eventDetails').textContent,
                to_email: 'info@nechmerust.org'
            };

            // Basic validation
            if (!templateParams.from_name || !templateParams.from_email) {
                showToast('Prosím vyplňte jméno a email.', 'error');
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
                return;
            }

            // Knihovna k dispozici?
            if (!window.emailjs || typeof emailjs.send !== 'function') {
                console.error('EmailJS není připraven, zkontrolujte načtení knihovny.');
                showToast('Nelze odeslat registraci (EmailJS není načten).', 'error');
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
                return;
            }

            try {
                const response = await emailjs.send("service_5hqwmpm", "template_1plexqr", templateParams);
                console.log('SUCCESS!', response.status, response.text);
                showToast('Registrace byla úspěšně odeslána!', 'success');
                closeRegistrationModal(); // Close modal on success
            } catch (error) {
                console.error('FAILED...', error);
                showToast('Odeslání se nepodařilo. Zkuste to znovu nebo napište na info@nechmerust.org', 'error');
            } finally {
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }

    // Zavření modalu kliknutím mimo obsah
    window.addEventListener('click', function (event) {
        const modal = document.getElementById('registrationModal');
        if (event.target === modal) {
            closeRegistrationModal();
        }
    });
});
