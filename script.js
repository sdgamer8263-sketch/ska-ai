import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, setDoc, doc, getDoc } from "./firebase.js";

// Attach events to buttons
document.getElementById("loginBtn").onclick = login;
document.getElementById("registerBtn").onclick = register;

// Login
async function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    document.getElementById("authBox").style.display = "none";
    document.getElementById("mainBox").style.display = "block";
    alert("Logged in as " + userCredential.user.email);
  } catch(e){ alert("Login failed: " + e.message); }
}

// Register
async function register(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Registered successfully! Please login.");
  } catch(e){ alert("Registration failed: " + e.message); }
}

// OCR scan
window.scanImage = function(event){
  const file = event.target.files[0];
  if(!file) return;
  Tesseract.recognize(file, 'eng')
    .then(({data:{text}})=>document.getElementById("question").value=text)
    .catch(e=>console.log(e));
}

// Solve question (basic AI logic)
window.solve = async function(){
  const q = document.getElementById("question").value.trim();
  const lang = document.getElementById("language").value;
  const userEmail = auth.currentUser.email;

  if(!q){ alert("Enter or scan question first!"); return; }

  let answer = "";
  if(/2\s*\+\s*2/.test(q)) answer="2 + 2 = 4";
  else answer="Step by step solution will appear here.";

  if(lang=="Hindi") answer="उत्तर: "+answer;
  if(lang=="Bengali") answer="উত্তর: "+answer;
  if(lang=="Hinglish") answer="Answer: "+answer;
  if(lang=="Banglish") answer="Answer: "+answer;

  document.getElementById("answer").innerText = answer;

  // Save QA
  try { await setDoc(doc(db, "users", userEmail), {lastQuestion:q,lastAnswer:answer,timestamp:new Date()}); } 
  catch(e){ console.log(e); }
}

// Load last QA
auth.onAuthStateChanged(async user=>{
  if(user){
    const docSnap = await getDoc(doc(db,"users",user.email));
    if(docSnap.exists()){
      const data=docSnap.data();
      document.getElementById("question").value=data.lastQuestion;
      document.getElementById("answer").innerText=data.lastAnswer;
    }
  }
});
