// Firebase imports (same as before)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAGVfIAcVsMh6YcXSqmu_PIkGgjCtwGNYc",
  authDomain: "ska-hosting-buddy-ai.firebaseapp.com",
  projectId: "ska-hosting-buddy-ai",
  storageBucket: "ska-hosting-buddy-ai.firebasestorage.app",
  messagingSenderId: "122658609461",
  appId: "1:122658609461:web:746da8ac58d37c12fed47c",
  measurementId: "G-DXPYQLX3KH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Login
window.login = function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      document.getElementById("authBox").style.display = "none";
      document.getElementById("mainBox").style.display = "block";
      console.log("Logged in:", userCredential.user.email);
    })
    .catch((error) => alert("Login failed: " + error.message));
}

// Register
window.register = function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Registered successfully! Please login.");
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
    })
    .catch((error) => alert("Registration failed: " + error.message));
}

// Firestore QA functions (same as before)
async function saveQA(userEmail, question, answer) {
  try {
    await setDoc(doc(db, "users", userEmail), {
      lastQuestion: question,
      lastAnswer: answer,
      timestamp: new Date()
    });
  } catch (e) { console.log("Error saving QA:", e); }
}

async function getLastQA(userEmail) {
  const docRef = doc(db, "users", userEmail);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}
