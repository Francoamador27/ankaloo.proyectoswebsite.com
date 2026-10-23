import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  Link,
  BlockQuote,
  Autoformat,
  PasteFromOffice,
} from "ckeditor5";
import esTranslations from "ckeditor5/translations/es.js";
import "ckeditor5/ckeditor5.css";

// Clave del plan Free de CKEditor (ckeditor.com/pricing). Sin clave usa "GPL".
const LICENSE_KEY = import.meta.env.VITE_CKEDITOR_LICENSE_KEY || "GPL";

const CONFIG = {
  licenseKey: LICENSE_KEY,
  plugins: [
    Essentials,
    Paragraph,
    Heading,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List,
    Link,
    BlockQuote,
    Autoformat,
    PasteFromOffice,
  ],
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "bulletedList",
    "numberedList",
    "|",
    "link",
    "blockQuote",
    "|",
    "undo",
    "redo",
  ],
  heading: {
    options: [
      { model: "paragraph", title: "Párrafo", class: "ck-heading_paragraph" },
      { model: "heading2", view: "h2", title: "Título", class: "ck-heading_heading2" },
      { model: "heading3", view: "h3", title: "Subtítulo", class: "ck-heading_heading3" },
    ],
  },
  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: "https://",
  },
  language: "es",
  translations: [esTranslations],
};

export default function EditorTexto({ value, onChange, placeholder }) {
  return (
    <div className="editor-abast">
      <style>{`
        .editor-abast .ck-editor__editable { min-height: 220px; font-size: 1rem; line-height: 1.6; }
        .editor-abast .ck.ck-editor__main > .ck-editor__editable { border-radius: 0 0 0.75rem 0.75rem; }
        .editor-abast .ck.ck-toolbar { border-radius: 0.75rem 0.75rem 0 0; }
        .editor-abast .ck-editor__editable.ck-focused { border-color: #fdce27 !important; box-shadow: 0 0 0 3px rgba(253,206,39,.25) !important; }
        .editor-abast .ck-content ul { list-style: disc; padding-left: 1.5rem; }
        .editor-abast .ck-content ol { list-style: decimal; padding-left: 1.5rem; }
        .editor-abast .ck-content h2 { font-size: 1.5rem; font-weight: 900; }
        .editor-abast .ck-content h3 { font-size: 1.25rem; font-weight: 800; }
        .editor-abast .ck-content a { color: #b38f00; text-decoration: underline; }
        .editor-abast .ck-content blockquote { border-left: 4px solid #fdce27; padding-left: 1rem; font-style: italic; }
      `}</style>
      <CKEditor
        editor={ClassicEditor}
        config={{ ...CONFIG, placeholder }}
        data={value || ""}
        onChange={(_, editor) => onChange(editor.getData())}
      />
    </div>
  );
}
