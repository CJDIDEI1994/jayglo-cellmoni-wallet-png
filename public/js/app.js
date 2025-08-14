document.addEventListener("DOMContentLoaded", ()=>{
    const forms = document.querySelectorAll("form");
    forms.forEach(form=>{
        form.addEventListener("submit", async (e)=>{
            e.preventDefault();
            const url = form.action;
            const data = new FormData(form);
            const obj = {};
            data.forEach((v,k)=>obj[k]=v);
            const res = await fetch(url, {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify(obj)
            });
            const result = await res.json();
            alert(result.message);
            if(result.message.includes("successful")) form.reset();
        });
    });
});
