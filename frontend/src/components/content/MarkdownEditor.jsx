import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  linkPlugin,
  imagePlugin,
  tablePlugin,
  MDXEditor,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

export default function MarkdownEditor(props) {
  return (
    <MDXEditor
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: "JavaScript",
            javascript: "JavaScript",
            css: "CSS",
            bash: "Bash",
            "": "Plain Text",
            plaintext: "Plain Text",
            text: "Plain Text",
            typescript: "TypeScript",
            tsx: "TypeScript React",
            jsx: "React",
            json: "JSON",
            html: "HTML",
            sql: "SQL",
            markdown: "Markdown",
            yaml: "YAML",
            env: "Bash",
          },
        }),
        linkPlugin(),
        imagePlugin(),
        tablePlugin(),
      ]}
      {...props}
    />
  );
}