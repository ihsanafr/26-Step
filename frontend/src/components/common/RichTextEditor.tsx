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
import { journalsService } from "../../services/journalsService";
import AlertModal from "./AlertModal";

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
  const [imageMenuOpen, setImageMenuOpen] = useState(false);
  const imageMenuRef = useRef<HTMLDivElement | null>(null);
  const [alertModal, setAlertModal] = useState<{ open: boolean; title: string; message: string; type: "error" | "warning" | "info" | "success" }>({
    open: false,
    title: "",
    message: "",
    type: "error",
  });
  const [uploadingImage, setUploadingImage] = useState(false);

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
        allowBase64: false, // Don't allow base64 to avoid max_allowed_packet issue
        HTMLAttributes: {
          class: 'tiptap-image',
          style: 'max-width: 100%; height: auto; display: block; margin: 1rem auto;',
        },
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

  // Close image menu when clicking outside
  useEffect(() => {
    if (!imageMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (imageMenuRef.current && !imageMenuRef.current.contains(e.target as Node)) {
        setImageMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [imageMenuOpen]);

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
    const url = window.prompt("Image URL (e.g., https://example.com/image.jpg)");
    if (!url) return;
    console.log("🔵 [RichTextEditor] Inserting image from URL:", url);
    editor.chain().focus().setImage({ src: url }).run();
    setImageMenuOpen(false);
  };

  const insertVideo = () => {
    const url = window.prompt("Video URL");
    if (!url) return;
    (editor.commands as any).setVideo({ src: url });
  };

  const triggerImageUpload = () => {
    console.log("🔵 [RichTextEditor] triggerImageUpload called", fileInputRef.current);
    if (fileInputRef.current) {
      fileInputRef.current.click();
      setImageMenuOpen(false);
    } else {
      console.error("❌ [RichTextEditor] fileInputRef is null");
    }
  };

  const onPickImage: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    console.log("🔵 [RichTextEditor] onPickImage called", file?.name);
    if (!file) {
      e.target.value = "";
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setAlertModal({
        open: true,
        title: "File Too Large",
        message: "Image size must be less than 5MB. Please choose a smaller image.",
        type: "warning",
      });
      e.target.value = "";
      return;
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setAlertModal({
        open: true,
        title: "Invalid File Type",
        message: "Please select a valid image file (JPG, PNG, GIF, or WebP).",
        type: "warning",
      });
      e.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);
      // Upload to backend instead of using base64
      console.log("🔵 [RichTextEditor] Uploading image to backend...", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });
      
      const uploadResponse = await journalsService.uploadContentImage(file);
      console.log("🟢 [RichTextEditor] Image uploaded successfully", {
        url: uploadResponse.url,
        path: uploadResponse.path,
      });
      
      if (!uploadResponse.url) {
        throw new Error("Server did not return image URL");
      }
      
      // Insert image with URL from backend
      editor.chain().focus().setImage({ 
        src: uploadResponse.url, 
        alt: file.name,
        title: file.name,
      }).run();
      
      console.log("🟢 [RichTextEditor] Image inserted into editor");
    } catch (err: any) {
      console.error("❌ [RichTextEditor] Error uploading image:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to upload image. Please try again.";
      setAlertModal({
        open: true,
        title: "Upload Failed",
        message: errorMessage,
        type: "error",
      });
    } finally {
      setUploadingImage(false);
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
          
          {/* Image dropdown */}
          <div className="relative" ref={imageMenuRef}>
            <ToolbarButton 
              title="Insert image" 
              active={imageMenuOpen}
              disabled={uploadingImage}
              onClick={() => setImageMenuOpen(!imageMenuOpen)}
            >
              {uploadingImage ? "..." : "Img"}
            </ToolbarButton>
            {imageMenuOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border border-gray-300 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800">
                <button
                  type="button"
                  onClick={triggerImageUpload}
                  disabled={uploadingImage}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {uploadingImage ? "Uploading..." : "Upload Image"}
                </button>
                <button
                  type="button"
                  onClick={insertImageFromUrl}
                  disabled={uploadingImage}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Image from URL
                </button>
              </div>
            )}
          </div>
          
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
        <EditorContent editor={editor} />
      </div>
      
      {/* Hidden file input for image upload */}
      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" 
        className="sr-only" 
        onChange={onPickImage}
        disabled={uploadingImage}
        aria-label="Upload image"
      />
      
      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.open}
        onClose={() => setAlertModal({ ...alertModal, open: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
}
