let users = JSON.parse(localStorage.getItem("skaUsers") || "{}");

const loginStep = document.getElementById("loginStep");
const registerStep = document.getElementById("registerStep");
const mainBox = document.getElementById("mainBox");

const loginInput = document.getElementById("loginInput");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");

const showRegister = document.getElementById("showRegister");
const backLogin = document.getElementById("backLogin");

const regUsername = document.getElementById("regUsername");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const regSubmit = document.getElementById("regSubmit");

const questionInput = document.getElementById("question");
const answerDiv = document.getElementById("answer");
const scanImageInput = document.getElementById("scanImage");
const languageSelect = document.getElementById("language");

// Show register/login forms
showRegister.onclick = ()=>{loginStep.style.display="none";registerStep.style.display="block";}
backLogin.onclick = ()=>{registerStep.style.display="none";loginStep.style.display="block";}

// REGISTER
regSubmit.onclick=()=>{
  const username=regUsername.value.trim();
  const email=regEmail.value.trim().toLowerCase();
  const password=regPassword.value.trim();
  if(!username||!email||!password){alert("Fill all fields");return;}
  if(users[email]||Object.values(users).some(u=>u.username.toLowerCase()===username.toLowerCase())){alert("❌ Email or Username exists");return;}
  users[email]={username,password};
  localStorage.setItem("skaUsers",JSON.stringify(users));
  alert("✅ Registration successful! Now login.");
  regUsername.value=""; regEmail.value=""; regPassword.value="";
  registerStep.style.display="none"; loginStep.style.display="block";
}

// LOGIN
loginBtn.onclick=()=>{
  const input=loginInput.value.trim().toLowerCase();
  const pass=loginPassword.value.trim();
  if(!input||!pass){alert("Fill both fields");return;}
  let found=null,userKey="";
  for(let emailKey in users){
    const user=users[emailKey];
    if(emailKey.toLowerCase()===input||user.username.toLowerCase()===input){found=user;userKey=emailKey;break;}
  }
  if(!found){alert("❌ User not found");return;}
  if(found.password!==pass){alert("❌ Incorrect password");return;}
  alert("✅ Login successful! Welcome "+found.username);
  loginStep.style.display="none"; mainBox.style.display="block";
  loginInput.value=""; loginPassword.value=""; loginInput.dataset.loggedUser=userKey;
}

// SCAN IMAGE
async function scanImage(){
  const file=scanImageInput.files[0];
  if(!file){alert("Select image first"); return;}
  answerDiv.innerText="Processing image...";
  const {data:{text}}=await Tesseract.recognize(file,'eng');
  questionInput.value=text.trim();
  answerDiv.innerText="Image scanned. Ready to solve!";
}

// FREE OpenRouter API (choose any of your listed free models)
const API_KEY = "sk-or-v1-d067a05ce5eab39f8b3a07f22616885007f762c31f3611ef3da3eb586eac5";
const MODEL = "meta-llama/llama-3.1-405b-instruct";

async function askFreeAPI(question){
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer "+API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      messages:[{role:"user",content:question}],
      max_tokens:500
    })
  });
  const data = await response.json();
  return data.choices[0].message.content;
}

// SOLVE QUESTION
async function solve(){
  const q=questionInput.value.trim();
  if(!q){alert("Enter question");return;}
  answerDiv.innerText="Processing...";

  const ans = await askFreeAPI(q); // Free API call

  // Multi-language support
  const lang = languageSelect.value;
  let finalAns = ans;
  if(lang=="Hindi") finalAns="उत्तर: "+ans;
  if(lang=="Bengali") finalAns="উত্তর: "+ans;
  if(lang=="Hinglish") finalAns="Answer: "+ans;
  if(lang=="Banglish") finalAns="Answer: "+ans;

  answerDiv.innerText = finalAns;

  // Save last QA
  const userKey = loginInput.dataset.loggedUser;
  if(userKey){
    users[userKey].lastQA={question:q,answer:finalAns,timestamp:new Date().toLocaleString()};
    localStorage.setItem("skaUsers",JSON.stringify(users));
  }
}
