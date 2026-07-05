(function () {
    "use strict";

    var form = document.getElementById("contactForm");
    if (!form) {
        return;
    }

    var submitButton = document.getElementById("contactSubmit");
    var statusContainer = document.getElementById("contactStatus");
    var defaultButtonText = "Send Message";
    var localHostnames = ["localhost", "127.0.0.1", "::1"];

    function isLocalDevelopment() {
        return localHostnames.indexOf(window.location.hostname) !== -1;
    }

    function showStatus(type, message) {
        statusContainer.innerHTML = "";

        var alert = document.createElement("div");
        alert.className = "alert alert-" + type;
        alert.textContent = message;
        statusContainer.appendChild(alert);
    }

    function submitContactForm(payload) {
        if (isLocalDevelopment()) {
            // Exercise the complete UI flow locally without contacting Vercel or GitHub.
            return new Promise(function (resolve) {
                window.setTimeout(function () {
                    resolve({ ok: true });
                }, 400);
            });
        }

        var endpoint = form.getAttribute("data-endpoint");
        if (!endpoint) {
            return Promise.reject(new Error("Contact endpoint is not configured"));
        }

        return fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            body: payload.toString()
        });
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Native validation checks required fields and the email format.
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
        form.setAttribute("aria-busy", "true");
        statusContainer.innerHTML = "";

        // URL-encoded data allows a simple cross-origin POST without exposing secrets.
        var payload = new URLSearchParams(new FormData(form));

        submitContactForm(payload)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Contact request failed");
                }

                form.reset();
                submitButton.textContent = "Message Sent";
                showStatus("success", "Thank you. Your message has been sent successfully.");
            })
            .catch(function () {
                submitButton.textContent = defaultButtonText;
                showStatus("danger", "Failed to send message. Please try again later.");
            })
            .finally(function () {
                submitButton.disabled = false;
                form.removeAttribute("aria-busy");
            });
    });
})();
