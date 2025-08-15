// ================= Dashboard user info =================
const userPhone = localStorage.getItem("loggedInUser");
if (userPhone) {
  async function loadUserInfo(phone) {
    try {
      const res = await fetch(`/getUser?phone=${phone}`);
      const data = await res.json();
      if (data.success) {
        const userInfoEl = document.getElementById("user-info");
        if (userInfoEl) {
          // ✅ Fix: use /uploads/ path which is served statically from server
          const profileSrc = data.profilePhoto ? `/uploads/${data.profilePhoto}` : "images/default-profile.png";
          userInfoEl.innerHTML = `
            <img src="${profileSrc}" alt="Profile" style="width:40px;height:40px;border-radius:50%;margin-right:8px;vertical-align:middle;">
            ${data.fullName} | ${data.phone}
          `;
        }
      }
    } catch (err) {
      console.error("Error loading user info:", err);
    }
  }
  loadUserInfo(userPhone);
} else {
  // Redirect to login if not logged in
  if (
    window.location.pathname.includes("dashboard") ||
    window.location.pathname.includes("deposit") ||
    window.location.pathname.includes("withdraw") ||
    window.location.pathname.includes("history")
  ) {
    window.location.href = "login.html";
  }
}
