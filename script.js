let users = JSON.parse(localStorage.getItem("skaUsers") || "{}");

// Elements
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

// Show register form
showRegister.onclick = () => { loginStep.style.display="none"; registerStep.style.display="block"; };
backLogin.onclick = () => { registerStep.style.display="none"; loginStep.style.display="block"; };

// REGISTER
regSubmit.onclick = () => {
  const username = regUsername.value.trim();
  const email = regEmail.value.trim().toLowerCase();
  const password = regPassword.value.trim();
  if(!username || !email || !password){ alert("Fill all fields"); return; }
  if(users[email] || Object.values(users).some(u=>u.username.toLowerCase()===username.toLowerCase())){ alert("❌ Email or Username exists"); return; }
  users[email]={username,password}; localStorage.setItem("skaUsers", JSON.stringify(users));
  alert("✅ Registration successful! Now login."); regUsername.value=""; regEmail.value=""; regPassword.value=""; registerStep.style.display="none"; loginStep.style.display="block";
};

// LOGIN
loginBtn.onclick = () => {
  const input = loginInput.value.trim().toLowerCase();
  const pass = loginPassword.value.trim();
  if(!input || !pass){ alert("Fill both fields"); return; }
  let found=null, userKey="";
  for(let emailKey in users){
    const user=users[emailKey];
    if(emailKey.toLowerCase()===input || user.username.toLowerCase()===input){ found=user; userKey=emailKey; break; }
  }
  if(!found){ alert("❌ User not found"); return; }
  if(found.password!==pass){ alert("❌ Incorrect password"); return; }
  alert("✅ Login successful! Welcome "+found.username);
  loginStep.style.display="none"; mainBox.style.display="block";
  loginInput.value=""; loginPassword.value="";
};

// Scan image input
async function scanImage(){
  const file = scanImageInput.files[0];
  if(!file){ alert("Select image first"); return; }
  answerDiv.innerText="Processing image...";
  const { data: { text } } = await Tesseract.recognize(file, 'eng');
  questionInput.value = text.trim();
  answerDiv.innerText="Image scanned. Ready to solve!";
}

// Solve question
async function solve(){
  const q = questionInput.value.trim();
  if(!q){ alert("Enter question"); return; }
  answerDiv.innerText="Processing...";
  await new Promise(r=>setTimeout(r,500)); // simulate async
  let ans="";
  if(/2\s*\+\s*2/.test(q)) ans="2 + 2 = 4"; else ans="Step by step solution will appear here.";
  const lang=languageSelect.value;
  if(lang=="Hindi") ans="उत्तर: "+ans;
  if(lang=="Bengali") ans="উত্তর: "+ans;
  if(lang=="Hinglish") ans="Answer: "+ans;
  if(lang=="Banglish") ans="Answer: "+ans;
  answerDiv.innerText=ans;
  // Save last QA per user
  let input=loginInput.value.trim().toLowerCase();
  let userKey="";
  for(let emailKey in users){
    const user=users[emailKey];
    if(emailKey.toLowerCase()===input || user.username.toLowerCase()===input){ userKey=emailKey; break; }
  }
  if(userKey){
    if(!users[userKey].lastQA) users[userKey].lastQA={};
    users[userKey].lastQA={question:q, answer:ans, timestamp:new Date().toLocaleString()};
    localStorage.setItem("skaUsers", JSON.stringify(users));
  }
}
