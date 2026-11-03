const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";

// Groq free tier: 8K tokens/minute, isliye input chhota rakhte hain
const MAX_TRANSCRIPT_CHARS = 10000;
const MAX_STYLE_CHARS = 700;

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const buildMessages = (transcript, previousPosts) => {
  const styleSamples = previousPosts
    .map((p, i) => `Sample ${i + 1}:\n${p.content.slice(0, MAX_STYLE_CHARS)}`)
    .join("\n\n");

  const system =
    "You are an expert blog writer. Turn the transcript into a well-structured " +
    "blog post in Markdown. Start with a single '# ' title line, then an " +
    "introduction, sections with '## ' headings, and a conclusion. Use only " +
    "information present in the transcript. Do not invent facts, quotes or " +
    "statistics.";

  const style = styleSamples
    ? `\n\nMatch the tone and writing style of the author's earlier posts:\n${styleSamples}`
    : "";

  return [
    { role: "system", content: system + style },
    { role: "user", content: `Transcript:\n${transcript}` },
  ];
};

// "# Title\n..." se title nikalta hai
const extractTitle = (markdown) => {
  const firstLine = markdown.split("\n").find((line) => line.trim()) || "";
  const title = firstLine.replace(/^#+\s*/, "").trim();
  return title.slice(0, 200) || "Untitled Post";
};

export const generateBlog = async (transcript, previousPosts = []) => {
  const truncated = transcript.length > MAX_TRANSCRIPT_CHARS;
  const text = truncated ? transcript.slice(0, MAX_TRANSCRIPT_CHARS) : transcript;

  let response;
  try {
    response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: buildMessages(text, previousPosts),
        temperature: 0.7,
        reasoning_effort: "low",
        max_completion_tokens: 3000,
      }),
      signal: AbortSignal.timeout(120000),
    });
  } catch (error) {
    throw httpError(502, "Blog service is not reachable. Try again.");
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw httpError(429, "Blog generation limit reached. Please try again later.");
    }
    throw httpError(502, "Blog generation failed. Please try again.");
  }

  const data = await response.json();
  const content = (data.choices?.[0]?.message?.content || "").trim();

  if (!content) {
    throw httpError(502, "Blog generation returned no content. Please try again.");
  }

  return { title: extractTitle(content), content, truncated };
};