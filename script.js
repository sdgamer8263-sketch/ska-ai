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

    // Find user by email or username
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
    alert("Registered successfully! You can login now.");
    document.getElementById("registerStep").style.display="none";
    document.getElementById("loginStep").style.display="block";
});

// ------------------- LOGOUT -------------------
document.getElementById("logoutBtn").addEventListener("click", ()=>{
    currentUser = null;
    document.getElementById("mainBox").style.display="none";
    document.getElementById("loginStep").style.display="block";
});

// ------------------- SCAN IMAGE USING TESSERACT -------------------
async function scanImage(){
    const file = document.getElementById("scanImage").files[0];
    if(!file){ alert("Select an image to scan!"); return; }

    const answerDiv = document.getElementById("answer");
    answerDiv.innerText = "Scanning image...";

    try {
        const result = await Tesseract.recognize(file, 'eng',{
            logger: m => console.log(m)
        });
        document.getElementById("question").value = result.data.text.trim();
        answerDiv.innerText = "Image scanned! You can now solve the question.";
    } catch(e){
        console.error(e);
        answerDiv.innerText = "Error scanning image!";
    }
}

// ------------------- OPENROUTER API REQUEST -------------------
async function askOpenRouter(questionText, imageBase64="", videoUrl=""){
    try {
        const messagesContent = questionText; // just plain string

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions",{
            method:"POST",
            headers:{
                "Authorization":"Bearer "+API_KEY,
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                model:"allenai/molmo-2-8b:free",
                messages:[{role:"user", content: messagesContent}],
                reasoning:true,
                max_tokens:500
            })
        });

        const data = await response.json();
        console.log("OpenRouter API response:", data);

        return data.choices?.[0]?.message?.content || "No answer returned";

    } catch(err){
        console.error(err);
        return "Error fetching answer!";
    }
}

// ------------------- SOLVE QUESTION -------------------
async function solve(){
    const questionInput = document.getElementById("question").value.trim();
    if(!questionInput){
        alert("Enter or scan a question!");
        return;
    }

    const lang = document.getElementById("language").value;
    const answerDiv = document.getElementById("answer");
    answerDiv.innerText = "Processing...";

    // Convert image to Base64 if selected
    let imageBase64 = "";
    const imgFile = document.getElementById("scanImage").files[0];
    if(imgFile){
        imageBase64 = await new Promise((resolve,reject)=>{
            const reader = new FileReader();
            reader.onload = ()=>resolve(reader.result);
            reader.onerror = err=>reject(err);
            reader.readAsDataURL(imgFile);
        });
    }

    // Ask OpenRouter
    let ans = await askOpenRouter(questionInput, imageBase64);

    // Multi-language prefix
    if(lang=="Hindi") ans="उत्तर: "+ans;
    if(lang=="Bengali") ans="উত্তর: "+ans;
    if(lang=="Hinglish") ans="Answer: "+ans;
    if(lang=="Banglish") ans="Answer: "+ans;

    // Step-by-step typing animation
    answerDiv.innerText = "";
    for(let i=0;i<ans.length;i++){
        answerDiv.innerText += ans[i];
        await new Promise(r => setTimeout(r, 15));
    }

    // Save last QA per user
    if(currentUser){
        users[currentUser].lastQA = {
            question: questionInput,
            answer: ans,
            timestamp: new Date().toLocaleString()
        };
        localStorage.setItem("skaUsers", JSON.stringify(users));
    }
}
