import { useState } from "react";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/services/api";
import { generatePost, transcribeMedia } from "@/services/postService";
import { postCreated } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";

const MAX_SIZE = 20 * 1024 * 1024; // 20MB

const validateFile = (file) => {
  if (!file || !file.size) return "Invalid file";
  if (file.size > MAX_SIZE) return "File size must not exceed 20MB";
  if (!file.type.startsWith("audio/") && !file.type.startsWith("video/")) {
    return "File must be an audio or a video file";
  }
  return null;
};

export default function UploadForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleTranscribe = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const file = new FormData(form).get("file");

    const problem = validateFile(file);
    if (problem) {
      toast({
        title: "❌ Something went wrong",
        variant: "destructive",
        description: problem,
      });
      return;
    }

    setLoading(true);
    try {
      toast({ title: "Upload has begun 🚀!" });

      let uploadNotified = false;
      const transcript = await transcribeMedia(file, () => {
        if (uploadNotified) return;
        uploadNotified = true;
        toast({ title: "uploaded successfully!" });
        toast({
          title: "🎙️ Transcription is in progress...",
          description:
            "Hang tight! Our digital wizards are sprinkling magic dust on your file! ✨",
        });
      });

      toast({
        title: "🤖 Generating AI blog post...",
        description: "Please wait while we generate your blog post.",
      });

      const { post, truncated } = await generatePost(transcript);
      dispatch(postCreated());

      toast({
        title: "🎉 Woohoo! Your AI blog is created! 🎊",
        description: truncated
          ? "Your recording was very long, so only the first part was used. Open the post and edit it!"
          : "Time to put on your editor hat, Click the post and edit it!",
      });
      form.reset();
      navigate(`/posts/${post._id}`);
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
        description: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleTranscribe}>
      <div className="flex justify-end items-center gap-1.5">
        <Input
          id="file"
          name="file"
          type="file"
          accept="audio/*,video/*"
          required
          disabled={loading}
        />
        <Button className="bg-purple-600" disabled={loading}>
          Transcribe
        </Button>
      </div>
    </form>
  );
}