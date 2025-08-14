// ================= Registration =================
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
                localStorage.setItem("registerSuccessMessage", data.message);
                setTimeout(()=> window.location.href="login.html", 1000);
            }
        })
        .catch(()=> showMessage("Error during registration."));
    });
}

// ================= Login =================
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

// ================= Show message =================
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

// ================= Deposit form submission =================
const depositForm = document.getElementById("depositForm");
if (depositForm) {
    depositForm.addEventListener("submit", e => {
        e.preventDefault();
        const formData = new FormData(depositForm);

        fetch("/deposit", { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                window.location.href = `success.html?type=deposit`;
            } else {
                document.getElementById("message").innerText = data.message;
            }
        })
        .catch(()=> document.getElementById("message").innerText = "Error submitting deposit.");
    });
}

// ================= Withdraw form submission =================
const withdrawForm = document.getElementById("withdrawForm");
if (withdrawForm) {
    withdrawForm.addEventListener("submit", e => {
        e.preventDefault();
        const formData = new FormData(withdrawForm);

        fetch("/withdraw", { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                window.location.href = `success.html?type=withdraw`;
            } else {
                document.getElementById("message").innerText = data.message;
            }
        })
        .catch(()=> document.getElementById("message").innerText = "Error submitting withdrawal.");
    });
}

// ================= Logout button =================
const logoutBtn = document.getElementById("logoutBtn");
if(logoutBtn) {
    logoutBtn.addEventListener("click", e=>{
        e.preventDefault();
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });
}

// ================= User Info for Dashboard =================
const userPhone = localStorage.getItem("loggedInUser");
if(userPhone){
    async function loadUserInfo(phone){
        try{
            const res = await fetch(`/getUserInfo?phone=${phone}`);
            const data = await res.json();
            if(data.success){
                const userInfoEl = document.getElementById("user-info");
                if(userInfoEl){
                    userInfoEl.innerText = `${data.fullName} | ${data.phone}`;
                }
            }
        } catch(err){
            console.error("Error loading user info:", err);
        }
    }
    loadUserInfo(userPhone);
}
