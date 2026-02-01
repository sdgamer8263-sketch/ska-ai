import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, setDoc, getDoc, doc } from "./firebase.js";

// Elements
const usernameField = document.getElementById("username");
const emailUsernameField = document.getElementById("emailUsername");
const passwordField = document.getElementById("password");
const actionBtn = document.getElementById("actionBtn");
const toggleBtn = document.getElementById("toggleBtn");
const formTitle = document.getElementById("formTitle");

let isLogin = true;

// Toggle login/register
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
actionBtn.onclick = async () => {
  const username = usernameField.value.trim();
  const emailUsername = emailUsernameField.value.trim();
  const password = passwordField.value.trim();

  if (!emailUsername || !password || (!isLogin && !username)) {
    alert("Please fill all required fields!");
    return;
  }

  try {
    if (isLogin) {
      // Login: email or username
      let loginEmail = emailUsername;

      // Check if username entered instead of email
      if (!emailUsername.includes("@")) {
        const userSnap = await getDoc(doc(db, "usernames", emailUsername));
        if (!userSnap.exists()) { 
          alert("Username not found"); 
          return; 
        }
        loginEmail = userSnap.data().email;
      }

      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, password);
      alert("✅ Login successful: " + userCredential.user.email);
      document.getElementById("authBox").style.display = "none";
      document.getElementById("mainBox").style.display = "block";

    } else {
      // Register
      const userCredential = await createUserWithEmailAndPassword(auth, emailUsername, password);
      const userEmail = userCredential.user.email;

      // Save username in Firestore
      await setDoc(doc(db, "users", userEmail), {
        username,
        lastQuestion: "",
        lastAnswer: "",
        timestamp: new Date()
      });

      // Save mapping username -> email
      await setDoc(doc(db, "usernames", username), { email: userEmail });

      alert("✅ Registration successful! Now login.");
      usernameField.value = "";
      emailUsernameField.value = "";
      passwordField.value = "";

      // Automatically switch to login form
      toggleBtn.click();
    }

  } catch (e) {
    alert("❌ Error: " + e.message);
    console.log("Firebase error:", e);
  }
};
