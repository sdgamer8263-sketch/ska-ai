// ------------------- CONFIG -------------------
const API_KEY = "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";
let users = JSON.parse(localStorage.getItem("skaUsers") || "{}");
let currentUser = null;

// ------------------- LOGIN / REGISTER TOGGLE -------------------
document.getElementById("showRegister").addEventListener("click", ()=>{
    document.getElementById("loginStep").style.display="none";
    document.getElementById("registerStep").style.display="block";
});
document.getElementById("backLogin").addEventListener("click", ()=>{
    document.getElementById("registerStep").style.display="none";
    document.getElementById("loginStep").style.display="block";
});

// ------------------- LOGIN -------------------
document.getElementById("loginBtn").addEventListener("click", ()=>{
    const loginInput = document.getElementById("loginInput").value.trim();
    const loginPassword = document.getElementById("loginPassword").value.trim();

    if(!loginInput || !loginPassword){
        alert("Enter username/email and password");
        return;
    }

    let found = null;
    for(let key in users){
        if(key === loginInput || users[key].username === loginInput){
            found = key;
            break;
        }
    }

    if(found && users[found].password === loginPassword){
        currentUser = found;
        document.getElementById("loginStep").style.display="none";
        document.getElementById("mainBox").style.display="block";
        alert("Login successful!");
    } else {
        alert("Invalid login!");
    }
});

// ------------------- REGISTER -------------------
document.getElementById("regSubmit").addEventListener("click", ()=>{
    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    if(!username || !email || !password){
        alert("Enter username, email and password");
        return;
    }

    if(users[email]){
        alert("User already exists! Login instead.");
        return;
    }

    users[email] = {username,password,lastQA:null};
    localStorage.setItem("skaUsers", JSON.stringify(users));
    alert("Registered successfully!");
    document.getElementById("registerStep").style.display="none";
    document.getElementById("loginStep").style.display="block";
});

// ------------------- SCAN IMAGE -------------------
async function scanImage(){
    const file = document.getElementById("scanImage").files[0];
    if(!file){ alert("Select an image"); return; }

    const answerDiv = document.getElementById("answer");
    answerDiv.innerText = "Scanning...";

    try {
        const result = await Tesseract.recognize(file, 'eng');
        document.getElementById("question").value = result.data.text.trim();
        answerDiv.innerText = "Image scanned!";
    } catch {
        answerDiv.innerText = "Scan failed!";
    }
}

// ------------------- OPENROUTER API -------------------
async function askOpenRouter(questionText){
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions",{
            method:"POST",
            headers:{
                "Authorization":"Bearer " + API_KEY,
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3.1-70b-instruct", // ✅ :free REMOVED
                messages:[
                    { role:"user", content: questionText }
                ],
                max_tokens: 500
            })
        });

        const data = await response.json();
        console.log(data);
        return data.choices?.[0]?.message?.content || "No answer returned";

    } catch {
        return "Network error";
    }
}

// ------------------- SOLVE -------------------
async function solve(){
    const questionInput = document.getElementById("question").value.trim();
    if(!questionInput){
        alert("Enter or scan a question!");
        return;
    }

    const answerDiv = document.getElementById("answer");
    answerDiv.innerText = "Processing...";

    let ans = await askOpenRouter(questionInput);

    answerDiv.innerText = "";
    for(let c of ans){
        answerDiv.innerText += c;
        await new Promise(r=>setTimeout(r,15));
    }
}
