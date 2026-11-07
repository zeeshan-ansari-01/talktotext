import api from "@/services/api";

// 1) Audio/video file -> transcript text
export const transcribeMedia = async (file, onUploadComplete) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/transcriptions", formData, {
    timeout: 180000, // 3 minute
    onUploadProgress: (event) => {
      // File poori bhej di gayi, ab server transcribe kar raha hai
      if (event.progress === 1) onUploadComplete?.();
    },
  });
  return data.transcript;
};

// 2) Transcript -> blog post (backend save bhi karta hai)
export const generatePost = async (transcript) => {
  const { data } = await api.post("/posts/generate", { transcript }, {
    timeout: 180000,
  });
  return { post: data.post, truncated: data.truncated };
};

// Meri saari posts
export const fetchPosts = async () => {
  const { data } = await api.get("/posts");
  return data.posts;
};

// Ek post
export const fetchPost = async (id) => {
  const { data } = await api.get(`/posts/${id}`);
  return data.post;
};

// Post ka title aur content update
export const updatePost = async (id, { title, content }) => {
  const { data } = await api.put(`/posts/${id}`, { title, content });
  return data.post;
};