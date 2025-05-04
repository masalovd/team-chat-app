import "quill/dist/quill.snow.css";

import Quill, { Delta, Op, type QuillOptions } from "quill";

import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

import Image from "next/image";
import { FileIcon, PaperclipIcon, Smile, XIcon } from "lucide-react";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";

import { Button } from "../ui/button";
import { Hint } from "./hint";
import { EmojiPopover } from "./emoji-popover";

type EditorValue = {
  file: File | null;
  filename: string | undefined;
  body: string;
};

interface EditorProps {
  variant?: "create" | "update";
  onSubmit: ({ file, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
}

const Editor = ({
  onCancel,
  onSubmit,
  placeholder = "Write a message",
  defaultValue = [],
  disabled = false,
  innerRef,
  variant = "create",
}: EditorProps) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const isEmpty = useMemo(
    () => !file && text.replace("/s*/g", "").trim().length === 0,
    [text, file],
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const onSubmitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const fileElementRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    onSubmitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div"),
    );

    // Options for the `quil` object (our text editor)
    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [
            {
              list: "ordered",
            },
            {
              list: "bullet",
            },
          ],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const addedFile = fileElementRef.current?.files?.[0] || null;
                const fileName = fileElementRef.current?.files?.[0].name;
                const isEmpty =
                  !!addedFile && text.replace("/s*/g", "").trim().length === 0;

                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());
                onSubmitRef.current({ body, file: addedFile, filename: fileName });
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };

    // Here we assign a quill object to quillRef.current property which we use
    // inside `Editor` component
    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    // If innerRef came from outside we also assign `quil` object to
    // it's innerRef.current property to control it from outside
    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const handleToolbarToggle = () => {
    setIsToolbarVisible((current) => !current);

    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");
    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;
    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
  };

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="*"
        ref={fileElementRef}
        onChange={(event) => setFile(event.target.files![0])}
        className="hidden"
      />
      <div
        className={cn(
          "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
          disabled && "opacity-50",
        )}
      >
        <div ref={containerRef} className="h-full ql-custom" />
        {!!file && (
          <div className="p-2">
            <div className="relative size-[62px] flex items-center justify-center group/file">
              <button
                onClick={() => {
                  setFile(null);
                  if (fileElementRef.current) fileElementRef.current.value = "";
                }}
                className="hidden group-hover/file:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
              >
                <XIcon className="size-3.5" />
              </button>

              {file.type.startsWith("image/") ? (
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Uploaded"
                  fill
                  className="rounded-xl overflow-hidden object-cover"
                />
              ) : (
                <div className="w-full h-full p-2 border rounded-xl bg-slate-100 flex flex-col items-center justify-center text-center">
                  <FileIcon className="size-5 text-slate-600 mb-1" />
                  <p className="text-[10px] text-slate-700 truncate max-w-[60px]">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {file.name.split(".").pop()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex px-2 pb-2 z-[5]">
          <Hint
            label={isToolbarVisible ? "Hide formatting" : "Show formatting"}
          >
            <Button
              disabled={disabled}
              variant={"ghost"}
              size={"iconSm"}
              onClick={handleToolbarToggle}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button disabled={disabled} variant={"ghost"} size={"iconSm"}>
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>
          {variant === "create" && (
            <Hint label="Attach file">
              <Button
                disabled={disabled}
                variant={"ghost"}
                size={"iconSm"}
                onClick={() => fileElementRef.current?.click()}
              >
                <PaperclipIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={onCancel}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                size={"sm"}
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    file,
                    filename: file?.name
                  });
                }}
                disabled={disabled || isEmpty}
                className=" bg-[#7F92DC] hover:bg-[#7F92DC]/80 text-white"
              >
                Save
              </Button>
            </div>
          )}
          {variant === "create" && (
            <Button
              disabled={disabled || isEmpty}
              onClick={() => {
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  file,
                  filename: file?.name
                });
              }}
              size={"iconSm"}
              className={cn(
                "ml-auto",
                isEmpty
                  ? "bg-white hover:bg-white text-muted-foreground"
                  : "bg-[#7F92DC] hover:bg-[#7F92DC]/80 text-white",
              )}
            >
              <MdSend />
            </Button>
          )}
        </div>
      </div>
      {variant === "create" && (
        <div
          className={cn(
            "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
            !isEmpty && "opacity-100",
          )}
        >
          <p>
            <strong>Shif+Return</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
