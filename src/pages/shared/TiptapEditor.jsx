import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const TiptapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="rounded border border-gray-300 dark:border-gray-700">
      <EditorContent
        editor={editor}
        className="min-h-[150px] p-2 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded"
      />
    </div>
  );
};

export default TiptapEditor;
