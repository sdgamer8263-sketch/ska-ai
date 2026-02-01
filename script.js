async function ask(){
  const q = document.getElementById("question").value;
  document.getElementById("answer").innerText = "Loading...";

  try {
    const res = await fetch(
      "https://ska-ai.rimjimsamantade.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          question: q
        })
      }
    );

    const data = await res.json();

    document.getElementById("answer").innerText =
      data.answer;

  } catch(e){
    document.getElementById("answer").innerText =
      "Network error";
  }
}
