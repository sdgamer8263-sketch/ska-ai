export default {
  async fetch(request, env) {

    if (request.method !== "POST") {
      return new Response("Only POST allowed", { status: 405 });
    }

    const body = await request.json();
    const question = body.question;

    const res = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer sk-or-v1-XXXXX",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct",
          messages: [{ role: "user", content: question }],
          max_tokens: 300
        })
      }
    );

    const data = await res.json();

    // 🔥 IMPORTANT: frontend-friendly response
    return new Response(
      JSON.stringify({
        answer: data.choices?.[0]?.message?.content || "No answer"
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
