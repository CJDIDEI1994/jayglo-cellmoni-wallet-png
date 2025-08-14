// Registration
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", e => {
        e.preventDefault();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!phone || !password) {
            showMessage("Please enter both phone and password.");
            return;
        }

        fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, password })
        })
        .then(res => res.json())
        .then(data => {
            showMessage(data.message);
            if(data.success){
                // Store success message for login page
                localStorage.setItem("registerSuccessMessage", data.message);
                setTimeout(()=> window.location.href="login.html", 1000);
            }
        })
        .catch(()=> showMessage("Error during registration."));
    });
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value.trim();

        fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, password })
        })
        .then(res => res.json())
        .then(data => {
            showMessage(data.message);
            if(data.success){
                localStorage.setItem("loggedInUser", phone);
                setTimeout(()=> window.location.href="dashboard.html", 1000);
            }
        })
        .catch(()=> showMessage("Error during login."));
    });
}

// Show message
function showMessage(msg){
    const msgEl = document.getElementById("message");
    if(msgEl) msgEl.innerText = msg;
}

// Display registration success message on login page
const regMsg = localStorage.getItem("registerSuccessMessage");
if (regMsg) {
    showMessage(regMsg);
    localStorage.removeItem("registerSuccessMessage");
}
