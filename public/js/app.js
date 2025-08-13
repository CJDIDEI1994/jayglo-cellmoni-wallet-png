function register() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        showMessage("Please enter both username and password.");
        return;
    }

    fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        showMessage(data.message);
    })
    .catch(() => showMessage("Error during registration."));
}

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        showMessage("Please enter both username and password.");
        return;
    }

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        showMessage(data.message);
        if (data.success) {
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        }
    })
    .catch(() => showMessage("Error during login."));
}

function showMessage(msg) {
    document.getElementById("message").innerText = msg;
}

// Logout button (only on dashboard page)
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        fetch("/logout", {
            method: "POST"
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = "index.html";
            }
        })
        .catch(() => alert("Logout failed."));
    });
}
