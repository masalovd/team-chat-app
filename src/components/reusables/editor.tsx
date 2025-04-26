import "quill/dist/quill.snow.css";

import Quill, { Delta, Op, type QuillOptions } from 'quill';

import { MutableRefObject, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { ImageIcon, Smile } from "lucide-react";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";

import { Button } from "../ui/button";
import { Hint } from "./hint";
import { cn } from "@/lib/utils";

type EditorValue = {
  image: File | null,
  body: string,
}

interface EditorProps {
  variant?: "create" | "update";
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder: string;
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
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const isEmpty = useMemo(
    () => text.replace("/s*/g", "").trim().length === 0,
    [text]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const onSubmitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);

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
      container.ownerDocument.createElement("div")
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
              handler: () => { },
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
    setText(quill.getText())

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
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-custom" />
        <div className="flex px-2 pb-2 z-[5]">
          <Hint label={isToolbarVisible ? "Hide formatting" : "Show formatting"}>
            <Button
              disabled={disabled}
              variant={"ghost"}
              size={"iconSm"}
              onClick={handleToolbarToggle}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <Hint label="Emoji">
            <Button
              disabled={disabled}
              variant={"ghost"}
              size={"iconSm"}
              onClick={() => { }}
            >
              <Smile className="size-4" />
            </Button>
          </Hint>
          {variant === "create" && (
            <Hint label="Attach image">
              <Button
                disabled={disabled}
                variant={"ghost"}
                size={"iconSm"}
                onClick={() => { }}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => { }}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                size={"sm"}
                onClick={() => { }}
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
              onClick={() => { }}
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
      <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
        <p>
          <strong>Shif+Return</strong> to add a new line
        </p>
      </div>
    </div>
  );
}

export default Editor;