// Users stored in localStorage
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

// Show register form
showRegister.onclick = () => {
  loginStep.style.display = "none";
  registerStep.style.display = "block";
};

// Back to login
backLogin.onclick = () => {
  registerStep.style.display = "none";
  loginStep.style.display = "block";
};

// REGISTER
regSubmit.onclick = () => {
  const username = regUsername.value.trim();
  const email = regEmail.value.trim().toLowerCase();
  const password = regPassword.value.trim();

  if (!username || !email || !password) { alert("Fill all fields"); return; }

  // Check if username/email already exists
  if (users[email] || Object.values(users).some(u=>u.username.toLowerCase()===username.toLowerCase())) {
    alert("❌ Email or Username already exists");
    return;
  }

  users[email] = {username,password};
  localStorage.setItem("skaUsers", JSON.stringify(users));

  alert("✅ Registration successful! Now login.");
  regUsername.value=""; regEmail.value=""; regPassword.value="";
  registerStep.style.display="none";
  loginStep.style.display="block";
};

// LOGIN (single input = Email OR Username)
loginBtn.onclick = () => {
  const input = loginInput.value.trim().toLowerCase();
  const pass = loginPassword.value.trim();

  if (!input || !pass) { alert("Fill both fields"); return; }

  let found = null;
  for (let key in users) {
    if (key.toLowerCase() === input || users[key].username.toLowerCase() === input) {
      found = users[key];
      break;
    }
  }

  if (!found) { alert("❌ User not found"); return; }
  if (found.password !== pass) { alert("❌ Incorrect password"); return; }

  alert("✅ Login successful! Welcome " + found.username);
  loginStep.style.display = "none";
  mainBox.style.display = "block";
};

// Solve question (basic multi-language)
window.solve = () => {
  const q = document.getElementById("question").value.trim();
  const lang = document.getElementById("language").value;
  if (!q) { alert("Enter question first!"); return; }

  let answer="";
  if (/2\s*\+\s*2/.test(q)) answer="2 + 2 = 4";
  else answer="Step by step solution will appear here.";

  if(lang=="Hindi") answer="उत्तर: "+answer;
  if(lang=="Bengali") answer="উত্তর: "+answer;
  if(lang=="Hinglish") answer="Answer: "+answer;
  if(lang=="Banglish") answer="Answer: "+answer;

  document.getElementById("answer").innerText=answer;
};
