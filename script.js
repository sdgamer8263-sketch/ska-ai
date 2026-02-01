const usernameField = document.getElementById("username");
const emailUsernameField = document.getElementById("emailUsername");
const passwordField = document.getElementById("password");
const actionBtn = document.getElementById("actionBtn");
const toggleBtn = document.getElementById("toggleBtn");
const formTitle = document.getElementById("formTitle");

let isLogin = true; // Default login

// Toggle Login/Register
toggleBtn.onclick = () => {
  isLogin = !isLogin;
  if (isLogin) {
    usernameField.style.display = "none";
    emailUsernameField.placeholder = "Email or Username";
    actionBtn.innerText = "Login";
    toggleBtn.innerText = "Switch to Register";
    formTitle.innerText = "Login";
  } else {
    usernameField.style.display = "block";
    emailUsernameField.placeholder = "Email";
    actionBtn.innerText = "Register";
    toggleBtn.innerText = "Switch to Login";
    formTitle.innerText = "Register";
  }
};

// Action button
actionBtn.onclick = () => {
  const username = usernameField.value.trim();
  const emailUsername = emailUsernameField.value.trim();
  const password = passwordField.value.trim();

  if (!emailUsername || !password || (!isLogin && !username)) {
    alert("Fill all required fields!");
    return;
  }

  // Load users from localStorage
  let users = JSON.parse(localStorage.getItem("skaUsers") || "{}");

  if (isLogin) {
    // Login
    let found = null;
    for (let key in users) {
      if (key === emailUsername || users[key].username === emailUsername) {
        found = users[key];
        break;
      }
    }
    if (!found) { alert("User not found"); return; }
    if (found.password !== password) { alert("Incorrect password"); return; }
    alert("✅ Login successful! Welcome " + found.username);
    document.getElementById("authBox").style.display = "none";
    document.getElementById("mainBox").style.display = "block";
  } else {
    // Register
    if (users[emailUsername] || Object.values(users).some(u=>u.username===username)) {
      alert("Email or username already exists");
      return;
    }
    users[emailUsername] = {username,password};
    localStorage.setItem("skaUsers", JSON.stringify(users));
    alert("✅ Registration successful! Now login.");
    usernameField.value = "";
    emailUsernameField.value = "";
    passwordField.value = "";
    toggleBtn.click(); // Switch to login
  }
};

// Solve question (basic)
window.solve = () => {
  const q = document.getElementById("question").value.trim();
  const lang = document.getElementById("language").value;
  if (!q) { alert("Enter question first!"); return; }

  let answer = "";
  if (/2\s*\+\s*2/.test(q)) answer = "2 + 2 = 4";
  else answer = "Step by step solution will appear here.";

  if (lang=="Hindi") answer="उत्तर: "+answer;
  if (lang=="Bengali") answer="উত্তর: "+answer;
  if (lang=="Hinglish") answer="Answer: "+answer;
  if (lang=="Banglish") answer="Answer: "+answer;

  document.getElementById("answer").innerText = answer;
};
