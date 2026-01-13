import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import FontFamily from "@tiptap/extension-font-family";
import Image from "@tiptap/extension-image";
import { Extension } from "@tiptap/core";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

function ToolbarButton({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition ${
        active
          ? "bg-brand-600 text-white"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

// Custom Indent extension
const Indent = Extension.create({
  name: "indent",
  addOptions() {
    return {
      types: ["paragraph", "heading"],
      minLevel: 0,
      maxLevel: 8,
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: null,
            parseHTML: (element) => {
              const indent = parseInt(element.style.textIndent || "0", 10);
              return indent || null;
            },
            renderHTML: (attributes) => {
              if (!attributes.indent) {
                return {};
              }
              return {
                style: `text-indent: ${attributes.indent}px`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from } = selection;
          const node = state.doc.nodeAt(from);
          if (!node) return false;
          const indent = (node.attrs.indent || 0) + 30;
          if (dispatch) {
            tr.setNodeMarkup(from, undefined, {
              ...node.attrs,
              indent: Math.min(indent, 240),
            });
          }
          return true;
        },
      outdent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from } = selection;
          const node = state.doc.nodeAt(from);
          if (!node) return false;
          const indent = Math.max((node.attrs.indent || 0) - 30, 0);
          if (dispatch) {
            tr.setNodeMarkup(from, undefined, {
              ...node.attrs,
              indent: indent || null,
            });
          }
          return true;
        },
    };
  },
});

// Custom Video extension
const Video = Extension.create({
  name: "video",
  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    };
  },
  inline() {
    return this.options.inline;
  },
  group: "block",
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "video[src]",
        getAttrs: (node) => {
          if (typeof node === "string") return false;
          const element = node as HTMLVideoElement;
          return {
            src: element.getAttribute("src"),
            alt: element.getAttribute("alt"),
            title: element.getAttribute("title"),
            width: element.getAttribute("width"),
            height: element.getAttribute("height"),
          };
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["video", { controls: "true", style: "width: 100%; max-width: 100%;", ...HTMLAttributes }];
  },
  addCommands() {
    return {
      setVideo:
        (options: { src: string; alt?: string; title?: string; width?: string; height?: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});

export default function RichTextEditor({
  value,
  onChange,
  readOnly = false,
  placeholder = "Write...",
}: {
  value: string;
  onChange: (html: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fontFamily, setFontFamily] = useState<string>("ui-sans-serif");
  const [fontSize, setFontSize] = useState<string>("default");
  const [blockType, setBlockType] = useState<string>("p");

  const FontSize = useMemo(
    () =>
      Extension.create({
        name: "fontSize",
        addGlobalAttributes() {
          return [
            {
              types: ["textStyle"],
              attributes: {
                fontSize: {
                  default: null,
                  parseHTML: (el) => (el as HTMLElement).style.fontSize?.replace("px", "") || null,
                  renderHTML: (attrs) => {
                    if (!attrs.fontSize) return {};
                    return { style: `font-size: ${attrs.fontSize}px` };
                  },
                },
              },
            },
          ];
        },
        addCommands() {
          return {
            setFontSize:
              (size: string) =>
              ({ chain }) =>
                chain().setMark("textStyle", { fontSize: size }).run(),
            unsetFontSize:
              () =>
              ({ chain }) =>
                chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
          } as any;
        },
      }),
    []
  );

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Video,
      Indent,
      Subscript,
      Superscript,
    ],
    []
  );

  const editor = useEditor({
    extensions,
    content: value || "",
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: "tiptap min-h-[260px] focus:outline-none",
        "data-placeholder": placeholder,
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // keep editor in sync when external value changes (e.g. opening edit modal)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((value || "") !== current) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!readOnly);
  }, [readOnly, editor]);

  if (!editor) {
    return (
      <div className="rounded-xl border border-gray-300 bg-transparent p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
        Loading editor...
      </div>
    );
  }

  // Keep toolbar selects in sync with current selection.
  useEffect(() => {
    if (!editor) return;
    const update = () => {
      const ff = (editor.getAttributes("textStyle").fontFamily as string | undefined) || "";
      const fs = (editor.getAttributes("textStyle").fontSize as string | undefined) || "";
      setFontFamily(ff || "ui-sans-serif");
      setFontSize(fs || "default");

      let bt = "p";
      if (editor.isActive("heading", { level: 1 })) bt = "h1";
      else if (editor.isActive("heading", { level: 2 })) bt = "h2";
      else if (editor.isActive("heading", { level: 3 })) bt = "h3";
      setBlockType(bt);
    };
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    update();
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev || "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const unsetLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
  };

  const setColor = () => {
    const prev = (editor.getAttributes("textStyle").color as string | undefined) || "";
    const c = window.prompt("Text color (hex like #ff0000)", prev || "#111827");
    if (c === null) return;
    if (!c) {
      editor.chain().focus().unsetColor().run();
      return;
    }
    editor.chain().focus().setColor(c).run();
  };

  const setHighlight = () => {
    const prev = (editor.getAttributes("highlight")?.color as string | undefined) || "";
    const c = window.prompt("Highlight color (hex like #ffff00)", prev || "#fef08a");
    if (c === null) return;
    if (!c) {
      editor.chain().focus().unsetHighlight().run();
      return;
    }
    editor.chain().focus().toggleHighlight({ color: c }).run();
  };

  const insertImageFromUrl = () => {
    const url = window.prompt("Image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  const insertVideo = () => {
    const url = window.prompt("Video URL");
    if (!url) return;
    (editor.commands as any).setVideo({ src: url });
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const onPickImage: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = () => reject(new Error("Failed to read image"));
        r.readAsDataURL(file);
      });
      editor.chain().focus().setImage({ src: dataUrl, alt: file.name }).run();
    } finally {
      // allow picking the same file again
      e.target.value = "";
    }
  };

  return (
    <div className="rounded-xl border border-gray-300 bg-white shadow-theme-xs dark:border-gray-700 dark:bg-gray-800">
      {!readOnly ? (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-200 bg-gray-100 p-2.5 dark:border-gray-700 dark:bg-gray-800">
          {/* Block type dropdown */}
          <select
            value={blockType}
            onChange={(e) => {
              const v = e.target.value;
              setBlockType(v);
              if (v === "p") editor.chain().focus().setParagraph().run();
              if (v === "h1") editor.chain().focus().toggleHeading({ level: 1 }).run();
              if (v === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
              if (v === "h3") editor.chain().focus().toggleHeading({ level: 3 }).run();
            }}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-500 dark:focus:border-brand-400"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%23344054' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
              appearance: "none",
            }}
          >
            <option value="p">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          {/* Font size dropdown */}
          <select
            value={fontSize}
            onChange={(e) => {
              const v = e.target.value;
              setFontSize(v);
              if (v === "default") (editor.commands as any).unsetFontSize();
              else (editor.commands as any).setFontSize(v);
            }}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-500 dark:focus:border-brand-400"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%23344054' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
              appearance: "none",
            }}
          >
            <option value="default">Normal</option>
            <option value="12">12</option>
            <option value="14">14</option>
            <option value="16">16</option>
            <option value="18">18</option>
            <option value="20">20</option>
            <option value="24">24</option>
            <option value="28">28</option>
            <option value="32">32</option>
          </select>

          {/* Font family dropdown */}
          <select
            value={fontFamily}
            onChange={(e) => {
              const v = e.target.value;
              setFontFamily(v);
              editor.chain().focus().setFontFamily(v).run();
            }}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-500 dark:focus:border-brand-400"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%23344054' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
              appearance: "none",
            }}
          >
            <option value="ui-sans-serif">Sans Serif</option>
            <option value="ui-serif">Serif</option>
            <option value="ui-monospace">Monospace</option>
          </select>

          <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />

          {/* Text formatting */}
          <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
            <span className="font-bold">B</span>
          </ToolbarButton>
          <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <span className="italic">I</span>
          </ToolbarButton>
          <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <span className="underline">U</span>
          </ToolbarButton>
          <ToolbarButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <span className="line-through">S</span>
          </ToolbarButton>

          <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />

          {/* Colors */}
          <ToolbarButton title="Text color" onClick={setColor}>
            <span className="underline">A</span>
          </ToolbarButton>
          <ToolbarButton title="Highlight color" active={editor.isActive("highlight")} onClick={setHighlight}>
            <span className="relative">
              <span className="underline">A</span>
              <span className="absolute -bottom-0.5 left-0 right-0 h-2 bg-yellow-300/60" />
            </span>
          </ToolbarButton>
          <ToolbarButton title="Subscript" active={editor.isActive("subscript")} onClick={() => editor.chain().focus().toggleSubscript().run()}>
            x<sub>₂</sub>
          </ToolbarButton>
          <ToolbarButton title="Superscript" active={editor.isActive("superscript")} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
            x<sup>²</sup>
          </ToolbarButton>

          <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />

          {/* Alignment */}
          <ToolbarButton title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
            L
          </ToolbarButton>
          <ToolbarButton title="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
            C
          </ToolbarButton>
          <ToolbarButton title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
            R
          </ToolbarButton>
          <ToolbarButton title="Justify" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
            J
          </ToolbarButton>

          <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />

          {/* Lists and blocks */}
          <ToolbarButton title="Ordered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <span className="text-xs font-mono">123</span>
          </ToolbarButton>
          <ToolbarButton title="Unordered list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <span className="text-xs">•</span>
          </ToolbarButton>
          <ToolbarButton title="Decrease indent" onClick={() => (editor.commands as any).outdent()}>
            <span className="text-xs">←</span>
          </ToolbarButton>
          <ToolbarButton title="Increase indent" onClick={() => (editor.commands as any).indent()}>
            <span className="text-xs">→</span>
          </ToolbarButton>
          <ToolbarButton title="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <span className="text-base leading-none">"</span>
          </ToolbarButton>
          <ToolbarButton title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            {"</>"}
          </ToolbarButton>

          <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />

          {/* Links and media */}
          <ToolbarButton title="Link" active={editor.isActive("link")} onClick={setLink}>
            Link
          </ToolbarButton>
          <ToolbarButton title="Unlink" disabled={!editor.isActive("link")} onClick={unsetLink}>
            Unlink
          </ToolbarButton>
          <ToolbarButton title="Insert image" onClick={triggerImageUpload}>
            Img
          </ToolbarButton>
          <ToolbarButton title="Insert video" onClick={insertVideo}>
            Video
          </ToolbarButton>

          <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />

          {/* Actions */}
          <ToolbarButton title="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
            <span className="text-xs">T<sub className="text-[10px]">x</sub></span>
          </ToolbarButton>
        </div>
      ) : null}

      <div className="p-4 bg-white dark:bg-gray-900">
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onPickImage} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
