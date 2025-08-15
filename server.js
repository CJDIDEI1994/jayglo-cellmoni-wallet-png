document.addEventListener("DOMContentLoaded", () => {
    // ================= Redirect to login if not logged in =================
    const userPhone = localStorage.getItem("loggedInUser");
    if(!userPhone) {
        window.location.href = "login.html";
        return;
    }

    // ================= Load User Info =================
    async function loadUserInfo(phone){
        try{
            const res = await fetch(`/getUser?phone=${phone}`);
            const data = await res.json();
            if(data.success){
                const userInfoEl = document.getElementById("user-info");
                if(userInfoEl){
                    userInfoEl.innerHTML = `<img src="uploads/${data.profilePhoto}" style="width:40px;height:40px;border-radius:50%;margin-right:8px;vertical-align:middle;"> ${data.fullName} | ${data.phone}`;
                }
                loadHistory(); // Load history after user info
            }
        } catch(err){ console.error(err); }
    }

    // ================= Load Transaction History =================
    async function loadHistory(){
        const res = await fetch('/history');
        const data = await res.json();
        const tableBody = document.getElementById('history-body');
        if(tableBody){
            tableBody.innerHTML = ""; // Clear previous rows
            data.forEach(t=>{
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${t.type}</td>
                    <td>${t.amount}</td>
                    <td>${t.proof || "-"}</td>
                    <td>${t.bank || "-"}</td>
                    <td>${t.accountNumber || t.cellmoniNumber || "-"}</td>
                    <td>${new Date(t.date).toLocaleString()}</td>
                    <td class="${t.status.toLowerCase()}">${t.status || "Pending"}</td>
                `;
                tableBody.appendChild(row);
            });
        }
    }

    loadUserInfo(userPhone);

    // ================= Logout =================
    const logoutBtn = document.getElementById("logoutBtn");
    if(logoutBtn){
        logoutBtn.addEventListener("click", e=>{
            e.preventDefault();
            localStorage.removeItem("loggedInUser");
            window.location.href = "login.html";
        });
    }

    // ================= Deposit Submission =================
    const depositForm = document.getElementById("depositForm");
    if(depositForm){
        depositForm.addEventListener("submit", e=>{
            e.preventDefault();
            const formData = new FormData(depositForm);
            fetch("/deposit",{method:"POST",body:formData})
            .then(res=>res.json())
            .then(data=>{
                showMessage(data.message,"deposit-message");
                if(data.success) depositForm.reset();
            })
            .catch(()=> showMessage("Error submitting deposit.","deposit-message"));
        });
    }

    // ================= Withdraw Submission =================
    const withdrawForm = document.getElementById("withdrawForm");
    if(withdrawForm){
        withdrawForm.addEventListener("submit", e=>{
            e.preventDefault();
            const formData = new FormData(withdrawForm);
            fetch("/withdraw",{method:"POST",body:formData})
            .then(res=>res.json())
            .then(data=>{
                showMessage(data.message,"withdraw-message");
                if(data.success) withdrawForm.reset();
            })
            .catch(()=> showMessage("Error submitting withdrawal.","withdraw-message"));
        });
    }

    // ================= Navbar Section Switching =================
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link=>{
        link.addEventListener('click', e=>{
            e.preventDefault();
            document.querySelectorAll('.section').forEach(sec=>sec.classList.remove('active'));
            const target = document.getElementById(link.dataset.section);
            if(target) target.classList.add('active');
            navLinks.forEach(l=>l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // ================= Customer Service =================
    document.getElementById("customer-service").addEventListener("click", e=>{
        e.preventDefault();
        window.open("https://wa.me/71634839", "_blank");
    });
});
