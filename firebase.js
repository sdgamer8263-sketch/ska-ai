import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function login(){
  let email=document.getElementById("email").value;
  let pass=document.getElementById("password").value;

  signInWithEmailAndPassword(auth,email,pass)
  .then(()=>{
    document.getElementById("loginBox").style.display="none";
    document.getElementById("mainBox").style.display="block";
  });
}
