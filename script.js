const API_KEY = "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";
let users = JSON.parse(localStorage.getItem("skaUsers") || "{}");
let currentUser = null;

// Convert file to Base64
async function fileToBase64(file){
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = ()=>resolve(reader.result);
    reader.onerror = err=>reject(err);
    reader.readAsDataURL(file);
  });
}

// OpenRouter API request
async function askOpenRouter(questionText, imageBase64="", videoUrl=""){
  const messagesContent = [{ type:"text", text: questionText }];
  if(imageBase64) messagesContent.push({ type:"image_url", image_url:{url:imageBase64} });
  if(videoUrl) messagesContent.push({ type:"video_url", video_url:{url:videoUrl} });

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions",{
    method:"POST",
    headers:{
      "Authorization":"Bearer "+API_KEY,
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      model:"allenai/molmo-2-8b:free",
      messages:[{role:"user", content: messagesContent}],
      reasoning:true,
      max_tokens:500
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No answer returned";
}

// Solve function
async function solve(){
  const questionInput = document.getElementById("questionInput").value.trim();
  const imageFile = document.getElementById("imageFileInput").files[0];
  const videoInput = document.getElementById("videoInput").value.trim();
  const lang = document.getElementById("languageSelect").value;
  const answerDiv = document.getElementById("answer");

  if(!questionInput && !imageFile && !videoInput){ alert("Enter question or select image/video"); return; }
  answerDiv.innerText="Processing...";

  let imageBase64="";
  if(imageFile) imageBase64 = await fileToBase64(imageFile);

  let ans = await askOpenRouter(questionInput, imageBase64, videoInput);

  if(lang=="Hindi") ans="उत्तर: "+ans;
  if(lang=="Bengali") ans="উত্তর: "+ans;
  if(lang=="Hinglish") ans="Answer: "+ans;
  if(lang=="Banglish") ans="Answer: "+ans;

  answerDiv.innerText="";
  for(let i=0;i<ans.length;i++){
    answerDiv.innerText+=ans[i];
    await new Promise(r=>setTimeout(r,15));
  }

  // Save last QA per user
  if(!users[currentUser]) users[currentUser]={};
  users[currentUser].lastQA={question:questionInput||"Image/Video",answer:ans,timestamp:new Date().toLocaleString()};
  localStorage.setItem("skaUsers", JSON.stringify(users));
}

// Login/Register functions
document.getElementById("loginBtn").addEventListener("click", ()=>{
  const email = document.getElementById("emailInput").value.trim();
  const username = document.getElementById("usernameInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();
  const msg = document.getElementById("authMsg");

  if(!email || !password){ msg.innerText="Enter email and password"; msg.className="error"; return; }
  if(users[email] && users[email].password===password){
    currentUser = email;
    document.getElementById("authDiv").style.display="none";
    document.getElementById("aiDiv").style.display="block";
    msg.innerText="Login successful"; msg.className="success";
  } else { msg.innerText="Invalid login"; msg.className="error"; }
});

document.getElementById("registerBtn").addEventListener("click", ()=>{
  const email = document.getElementById("emailInput").value.trim();
  const username = document.getElementById("usernameInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();
  const msg = document.getElementById("authMsg");

  if(!email || !password || !username){ msg.innerText="Enter username, email and password"; msg.className="error"; return; }
  if(users[email]){ msg.innerText="User already exists"; msg.className="error"; return; }
  users[email]={username,password,lastQA:null};
  localStorage.setItem("skaUsers", JSON.stringify(users));
  msg.innerText="Registered successfully! You can login now."; msg.className="success";
});

document.getElementById("logoutBtn").addEventListener("click", ()=>{
  currentUser = null;
  document.getElementById("authDiv").style.display="block";
  document.getElementById("aiDiv").style.display="none";
});
document.getElementById("solveBtn").addEventListener("click", solve);
