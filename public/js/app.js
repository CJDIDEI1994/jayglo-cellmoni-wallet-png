// ================= Show message =================
function showMessage(msg){
    const msgEl = document.getElementById("message");
    if(msgEl) msgEl.innerText = msg;
}

// ================= Registration =================
const registerForm = document.getElementById("registerForm");
if(registerForm){
    registerForm.addEventListener("submit", e => {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const profilePhoto = document.getElementById("profilePhoto").files[0];
        const idPhoto = document.getElementById("idPhoto").files[0];

        if(!fullName || !phone || !password || !confirmPassword || !profilePhoto || !idPhoto){
            showMessage("All fields are required.");
            return;
        }
        if(password !== confirmPassword){
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

        fetch("/register",{ method:"POST", body:formData })
        .then(res=>res.json())
        .then(data=>{
            showMessage(data.message);
            if(data.success){
                localStorage.setItem("registerSuccessMessage", data.message);
                setTimeout(()=> window.location.href="login.html",1000);
            }
        })
        .catch(()=>showMessage("Error during registration."));
    });
}

// ================= Login =================
const loginForm = document.getElementById("loginForm");
if(loginForm){
    loginForm.addEventListener("submit", e=>{
        e.preventDefault();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value.trim();

        fetch("/login",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({phone,password})
        })
        .then(res=>res.json())
        .then(data=>{
            showMessage(data.message);
            if(data.success){
                localStorage.setItem("loggedInUser", phone);
                window.location.href="dashboard.html"; // Directly go to dashboard
            }
        })
        .catch(()=>showMessage("Error during login."));
    });
}

// ================= Display registration success message on login page =================
const regMsg = localStorage.getItem("registerSuccessMessage");
if(regMsg){
    showMessage(regMsg);
    localStorage.removeItem("registerSuccessMessage");
}

// ================= Logout =================
const logoutBtn = document.getElementById("logoutBtn");
if(logoutBtn){
    logoutBtn.addEventListener("click", e=>{
        e.preventDefault();
        localStorage.removeItem("loggedInUser");
        window.location.href="login.html";
    });
}

// ================= Load dashboard page =================
window.addEventListener("DOMContentLoaded", ()=>{

    const userPhone = localStorage.getItem("loggedInUser");
    if(userPhone){
        // Load user info
        const userInfoEl = document.getElementById("user-info");
        if(userInfoEl){
            fetch(`/getUser?phone=${userPhone}`)
            .then(res=>res.json())
            .then(data=>{
                if(data.success){
                    userInfoEl.innerHTML = `<img src="uploads/${data.profilePhoto}" alt="Profile" style="width:40px; height:40px; border-radius:50%; margin-right:8px; vertical-align:middle;"> ${data.fullName} | ${data.phone}`;
                }
            })
            .catch(err=>console.error(err));
        }

        // Load transaction history if table exists
        const tableBody = document.getElementById("history-body");
        if(tableBody){
            fetch("/history")
            .then(res=>res.json())
            .then(data=>{
                tableBody.innerHTML="";
                data.forEach(t=>{
                    const row = document.createElement("tr");
                    row.innerHTML=`
                        <td>${t.type}</td>
                        <td>${t.amount}</td>
                        <td>${t.proof||"-"}</td>
                        <td>${t.bank||"-"}</td>
                        <td>${t.accountNumber||t.cellmoniNumber||"-"}</td>
                        <td>${new Date(t.date).toLocaleString()}</td>
                        <td class="${t.status.toLowerCase()}">${t.status||"Pending"}</td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(err=>console.error(err));
        }
    }

    // Deposit form
    const depositForm = document.getElementById("depositForm");
    if(depositForm){
        depositForm.addEventListener("submit", e=>{
            e.preventDefault();
            const formData = new FormData(depositForm);
            fetch("/deposit",{ method:"POST", body:formData })
            .then(res=>res.json())
            .then(data=>{
                if(data.success){
                    window.location.href="success.html?type=deposit";
                } else showMessage(data.message);
            })
            .catch(()=>showMessage("Error submitting deposit."));
        });
    }

    // Withdraw form
    const withdrawForm = document.getElementById("withdrawForm");
    if(withdrawForm){
        withdrawForm.addEventListener("submit", e=>{
            e.preventDefault();
            const formData = new FormData(withdrawForm);
            fetch("/withdraw",{ method:"POST", body:formData })
            .then(res=>res.json())
            .then(data=>{
                if(data.success){
                    window.location.href="success.html?type=withdraw";
                } else showMessage(data.message);
            })
            .catch(()=>showMessage("Error submitting withdrawal."));
        });
    }
});
