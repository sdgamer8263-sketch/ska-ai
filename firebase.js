// 1️⃣ Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// 2️⃣ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGVfIAcVsMh6YcXSqmu_PIkGgjCtwGNYc",
  authDomain: "ska-hosting-buddy-ai.firebaseapp.com",
  projectId: "ska-hosting-buddy-ai",
  storageBucket: "ska-hosting-buddy-ai.firebasestorage.app",
  messagingSenderId: "122658609461",
  appId: "1:122658609461:web:746da8ac58d37c12fed47c",
  measurementId: "G-DXPYQLX3KH"
};

// 3️⃣ Initialize Firebase
const app = initializeApp(firebaseConfig);

// 4️⃣ Initialize Authentication
const auth = getAuth(app);

// 5️⃣ Initialize Firestore
const db = getFirestore(app);

// 6️⃣ Login function
window.login = function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Login successful
      document.getElementById("loginBox").style.display = "none";
      document.getElementById("mainBox").style.display = "block";
      console.log("User logged in:", userCredential.user.email);
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
}

// 7️⃣ Save Question & Answer to Firestore
async function saveQA(userEmail, question, answer) {
  try {
    await setDoc(doc(db, "users", userEmail), {
      lastQuestion: question,
      lastAnswer: answer,
      timestamp: new Date()
    });
    console.log("Saved to database");
  } catch (e) {
    console.log("Error saving QA:", e);
  }
}

// 8️⃣ Get Last Question & Answer from Firestore
async function getLastQA(userEmail) {
  const docRef = doc(db, "users", userEmail);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Last QA:", docSnap.data());
    return docSnap.data();
  } else {
    console.log("No previous QA found");
    return null;
  }
}

// 9️⃣ Example usage after solving a question
// This should be called inside your solve() function
/*
const userEmail = auth.currentUser.email;
saveQA(userEmail, "2+2=?", "2+2=4");
getLastQA(userEmail).then(data => {
  if(data) console.log("Retrieved last QA:", data);
});
*/
