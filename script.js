function solve() {
  let q = document.getElementById("question").value;
  let lang = document.getElementById("language").value;

  let answer = "Answer generated using smart AI logic:\n\n";

  if(q.includes("2+2")) answer += "2 + 2 = 4";
  else answer += "Step by step solution will appear here.";

  document.getElementById("answer").innerText = answer;
}

function scanImage(event) {
  const file = event.target.files[0];
  Tesseract.recognize(file,'eng').then(({data:{text}})=>{
    document.getElementById("question").value = text;
  });
}
