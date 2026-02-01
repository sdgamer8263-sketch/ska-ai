// 1️⃣ Scan image using Tesseract.js
function scanImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  Tesseract.recognize(file, 'eng')
    .then(({ data: { text } }) => {
      document.getElementById("question").value = text;
    })
    .catch(err => console.log("OCR error:", err));
}

// 2️⃣ Solve Question (AI logic)
async function solve() {
  const question = document.getElementById("question").value.trim();
  const lang = document.getElementById("language").value;
  const userEmail = auth.currentUser.email;

  if (!question) {
    alert("Please enter or scan a question first!");
    return;
  }

  // Simple AI solver logic (replace with real logic or API later)
  let answer = "";

  if (/2\s*\+\s*2/.test(question)) answer = "2 + 2 = 4";
  else if (/area of circle/i.test(question)) answer = "Area = π × r²";
  else answer = "Step by step solution will appear here.";

  // Language support (very simple example)
  if (lang === "Hindi") answer = "उत्तर: " + answer;
  if (lang === "Bengali") answer = "উত্তর: " + answer;
  if (lang === "Hinglish") answer = "Answer: " + answer;
  if (lang === "Banglish") answer = "Answer: " + answer;

  // Show answer
  document.getElementById("answer").innerText = answer;

  // Save QA to Firestore
  await saveQA(userEmail, question, answer);
}

// 3️⃣ Load last QA on page load
window.onload = async function() {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const lastQA = await getLastQA(user.email);
      if (lastQA) {
        document.getElementById("question").value = lastQA.lastQuestion;
        document.getElementById("answer").innerText = lastQA.lastAnswer;
      }
    }
  });
}
