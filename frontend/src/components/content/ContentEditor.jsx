import { useCallback, useState } from "react";
import { Download, Edit2, Loader2 } from "lucide-react";

import BgGradient from "@/components/common/BgGradient";
import MarkdownEditor from "@/components/content/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/services/api";
import { updatePost } from "@/services/postService";

// Content ki pehli line se title nikalta hai ("# Title" -> "Title")
const getTitle = (content, fallback) => {
  const firstLine = content.split("\n").find((line) => line.trim()) || "";
  const title = firstLine.replace(/^#+\s*/, "").trim().slice(0, 200);
  return title || fallback;
};

export default function ContentEditor({ post }) {
  const [content, setContent] = useState(
    post.content.replace(/```plaintext/g, "```")
  );
  const [title, setTitle] = useState(post.title);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const newTitle = getTitle(content, title);
      await updatePost(post._id, { title: newTitle, content });
      setTitle(newTitle);
      toast({ title: "Post updated ✅" });
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
        description: getErrorMessage(error),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExport = useCallback(() => {
    const safeName = (title || "blog-post").replace(/[\\/:*?"<>|]/g, "");
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeName}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [content, title]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center border-b-2 border-gray-200/50 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            📝 Edit your post
          </h2>
          <p className="text-gray-600">Start editing your blog post below...</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button
            type="submit"
            disabled={saving}
            className="flex-1 sm:flex-none sm:w-40 bg-gradient-to-r from-purple-900 to-indigo-600 hover:from-purple-600 hover:to-indigo-900 text-white font-semibold py-2 px-4 rounded-full shadow-lg transform transition duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2"
          >
            {saving ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Updating...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Edit2 className="w-5 h-5 mr-2" />
                Update Text
              </span>
            )}
          </Button>
          <Button
            type="button"
            onClick={handleExport}
            className="flex-1 sm:flex-none sm:w-40 bg-gradient-to-r from-amber-500 to-amber-900 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transform transition duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
          >
            <Download className="w-5 h-5 mr-2" />
            Export
          </Button>
        </div>
      </div>
      <BgGradient>
        <MarkdownEditor
          markdown={content}
          className="markdown-content border-dotted border-gray-200 border-2 p-4 rounded-md animate-in ease-in-out duration-75"
          onChange={setContent}
        />
      </BgGradient>
    </form>
  );
}