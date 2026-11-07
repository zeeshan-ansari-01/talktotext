import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ContentEditor from "@/components/content/ContentEditor";
import { getErrorMessage } from "@/services/api";
import { fetchPost } from "@/services/postService";

export default function PostEditor() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setPost(null);
    setError("");
    fetchPost(id)
      .then(setPost)
      .catch((err) => setError(getErrorMessage(err)));
  }, [id]);

  return (
    <div className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-0 mb-12 mt-28">
      {error && <p className="text-red-600">{error}</p>}
      {!post && !error && <p className="text-gray-600">Loading your post...</p>}
      {post && <ContentEditor key={post._id} post={post} />}
    </div>
  );
}