"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
    defaultValue?: string;
    onChange: (value: string) => void;
}

export default function RichTextEditor({ defaultValue, onChange }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill>();

    useEffect(() => {
        if (typeof window !== "undefined" && editorRef.current && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: "snow",
                placeholder: "Contenido",
            });

            if (defaultValue) {
                quillRef.current.root.innerHTML = defaultValue;
            }

            quillRef.current.on("text-change", () => {
                const html = quillRef.current!.root.innerHTML;
                onChange(html);
            });
        }
    }, [defaultValue, onChange]);

    return (
        <div>
            <div ref={editorRef} className="h-40" />
        </div>
    );
}
