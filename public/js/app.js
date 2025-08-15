// public/js/app.js
document.addEventListener("DOMContentLoaded", () => {
  // ---------------- Utilities ----------------
  const showMessage = (msg) => {
    const el = document.getElementById("message");
    if (el) el.innerText = msg || "";
  };

  const path = window.location.pathname.toLowerCase();
  const isPage = (name) => path.endsWith(`/${name.toLowerCase()}`);

  const loggedInPhone = localStorage.getItem("loggedInUser");

  // ---------------- Gate pages that require auth ----------------
  const authPages = ["dashboard.html", "deposit.html", "withdraw.html", "history.html"];
  if (authPages.some(isPage)) {
    if (!loggedInPhone) {
      // Not logged in? Go to login first.
      window.location.replace("login.html");
      return;
    }
  }

  // ---------------- Registration ----------------
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fullName = document.getElementById("fullName").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();
      const profilePhoto = document.getElementById("profilePhoto").files[0];
      const idPhoto = document.getElementById("idPhoto").files[0];

      if (!fullName || !phone || !password || !confirmPassword || !profilePhoto || !idPhoto) {
        showMessage("All fields are required.");
        return;
      }
      if (password !== confirmPassword) {
        showMessage("Passwords do not match.");
        return;
      }

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      formData.append("profilePhoto", profilePhoto);
      formData.append("idPhoto", idPhoto);

      try {
        const res = await fetch("/register", { method: "POST", body: formData });
        const data = await res.json();
        showMessage(data.message);
        if (data.success) {
          localStorage.setItem("registerSuccessMessage", data.message);
          setTimeout(() => (window.location.href = "login.html"), 900);
        }
      } catch {
        showMessage("Error during registration.");
      }
    });
  }

  // ---------------- Login ----------------
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    // Show “registered successfully” if coming from registration
    const regMsg = localStorage.getItem("registerSuccessMessage");
    if (regMsg) {
      showMessage(regMsg);
      localStorage.removeItem("registerSuccessMessage");
    }

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const phone = document.getElementById("phone").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
        const res = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, password }),
        });
        const data = await res.json();
        showMessage(data.message);
        if (data.success) {
          localStorage.setItem("loggedInUser", phone);
          // Go straight to dashboard
          window.location.href = "dashboard.html";
        }
      } catch {
        showMessage("Error during login.");
      }
    });
  }

  // ---------------- Logout ----------------
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    });
  }

  // ---------------- Dashboard user info ----------------
  if (loggedInPhone && document.getElementById("user-info")) {
    (async () => {
      try {
        const res = await fetch(`/getUser?phone=${encodeURIComponent(loggedInPhone)}`);
        const data = await res.json();
        if (data.success) {
          const userInfoEl = document.getElementById("user-info");
          userInfoEl.innerHTML = `
            <img src="uploads/${data.profilePhoto}" alt="Profile"
                 style="width:40px;height:40px;border-radius:50%;margin-right:8px;vertical-align:middle;">
            ${data.fullName} | ${data.phone}
          `;
        }
      } catch (err) {
        console.error("Error loading user info:", err);
      }
    })();
  }

  // ---------------- Deposit ----------------
  const depositForm = document.getElementById("depositForm");
  if (depositForm) {
    depositForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(depositForm);

      try {
        const res = await fetch("/deposit", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) {
          window.location.href = "success.html?type=deposit";
        } else {
          showMessage(data.message);
        }
      } catch {
        showMessage("Error submitting deposit.");
      }
    });
  }

  // ---------------- Withdraw ----------------
  const withdrawForm = document.getElementById("withdrawForm");
  if (withdrawForm) {
    withdrawForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(withdrawForm);

      try {
        const res = await fetch("/withdraw", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) {
          window.location.href = "success.html?type=withdraw";
        } else {
          showMessage(data.message);
        }
      } catch {
        showMessage("Error submitting withdrawal.");
      }
    });
  }

  // ---------------- History (no duplicates) ----------------
  const historyBody = document.getElementById("history-body");
  if (historyBody) {
    (async () => {
      try {
        const res = await fetch("/history");
        const data = await res.json();

        // Clear first to avoid duplicate rows
        historyBody.innerHTML = "";

        data.forEach((t) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${t.type || "-"}</td>
            <td>${t.amount || "-"}</td>
            <td>${t.proof || "-"}</td>
            <td>${t.bank || "-"}</td>
            <td>${t.accountNumber || t.cellmoniNumber || "-"}</td>
            <td>${t.date ? new Date(t.date).toLocaleString() : "-"}</td>
            <td class="${(t.status || "Pending").toLowerCase()}">${t.status || "Pending"}</td>
          `;
          historyBody.appendChild(tr);
        });
      } catch (err) {
        console.error("Error loading history:", err);
      }
    })();
  }

  // ---------------- Success page helper (optional) ----------------
  // If you added an element with id="successMessage" in success.html,
  // this will show a friendly message based on ?type=deposit|withdraw
  const successEl = document.getElementById("successMessage");
  if (successEl) {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    if (type === "deposit") {
      successEl.textContent = "Deposit submitted. Please wait while we process your transaction.";
    } else if (type === "withdraw") {
      successEl.textContent = "Withdrawal submitted. Please wait while we process your transaction.";
    } else {
      successEl.textContent = "Submission received. Please wait while we process your request.";
    }
  }
});
