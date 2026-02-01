import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, setDoc, doc, getDoc } from "./firebase.js";

// Attach events
document.getElementById("loginBtn").onclick = login;
document.getElementById("registerBtn").onclick = register;

// Login
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) { alert("Enter email and password"); return; }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    document.getElementById("authBox").style.display = "none";
    document.getElementById("mainBox").style.display = "block";
    alert("Logged in as " + userCredential.user.email);
  } catch (e) { alert("Login failed: " + e.message); }
}

// Register
async function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!username || !email || !password) { alert("Enter username, email and password"); return; }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userEmail = userCredential.user.email;

    // Save username in Firestore
    await setDoc(doc(db, "users", userEmail), {
      username: username,
      lastQuestion: "",
      lastAnswer: "",
      timestamp: new Date()
    });

    alert("Registered successfully! Now login.");
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

  } catch (e) { alert("Registration failed: " + e.message); }
}

// OCR scan
window.scanImage = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  Tesseract.recognize(file, 'eng')
    .then(({data:{text}}) => document.getElementById("question").value=text)
    .catch(e => console.log(e));
}

// Solve question (basic)
window.solve = async function() {
  const q = document.getElementById("question").value.trim();
  const lang = document.getElementById("language").value;
  const user = auth.currentUser;
  if (!q || !user) { alert("Enter question and login"); return; }

  let answer = "";
  if (/2\s*\+\s*2/.test(q)) answer = "2 + 2 = 4";
  else answer = "Step by step solution will appear here.";

  if (lang == "Hindi") answer = "उत्तर: "+answer;
  if (lang == "Bengali") answer = "উত্তর: "+answer;
  if (lang == "Hinglish") answer = "Answer: "+answer;
  if (lang == "Banglish") answer = "Answer: "+answer;

  document.getElementById("answer").innerText = answer;

  // Save QA
  try { await setDoc(doc(db, "users", user.email), {lastQuestion:q, lastAnswer:answer, timestamp:new Date()},{merge:true}); }
  catch(e){ console.log(e); }
}

// Load last QA on login
auth.onAuthStateChanged(async user => {
  if (user) {
    const docSnap = await getDoc(doc(db,"users",user.email));
    if (docSnap.exists()){
      const data = docSnap.data();
      document.getElementById("question").value = data.lastQuestion || "";
      document.getElementById("answer").innerText = data.lastAnswer || "";
    }
  }
});
