"use client"

import React from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

export default function ChatBox() {
    const [messages, setMessages] = React.useState<Message[]>([
        { id: 1, sender: "bot", text: "Welcome to Mucharla AI!" },
        { id: 2, sender: "bot", text: "Send whatever text prompts you like, see your chat history, and get real AI responses!"},
    ]);

    return (
        <div className="py-8 flex items-center justify-center bg-gray-100">
            <div className="w-[500px] h-[500px] bg-white rounded-2xl shadow-lg flex flex-col p-6 overflow-hidden mt-2">
            <div className="flex-1 overflow-y-auto flex flex-col gap-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md text-base ${
                            msg.sender === "user"
                                ? "self-end bg-blue-600 text-white"
                                : "self-start bg-gray-200 text-gray-900"
                        }`}
                    >
                        <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(String(marked.parse(msg.text))) }}/>
                    </div>
                ))}
            </div>
            <form
                className="mt-4 flex gap-2"
                onSubmit={e => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const input = form.elements.namedItem("message") as HTMLInputElement;
                    const text = input.value.trim();
                    if (!text) return;

                    const tempId = Date.now();

                    setMessages(prev => [
                        ...prev,
                        {
                            id: prev.length + 1,
                            sender: "user",
                            text,
                        },
                        {
                            id: tempId,
                            sender: "bot",
                            text: "Generating your response...",
                        },
                    ]);

                    fetch("/api/ai-chat", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ message: text }),
                        })
                        .then(async res => {
                            let data;
                            try {
                                data = await res.json();
                            } catch {
                                data = {};
                            }
                            
                            const responseText = await Promise.resolve(data.response || "Sorry, I didn't understand that.");

                            setMessages(prev => 
                                prev.map(msg =>
                                    msg.id === tempId ? { ...msg, text: responseText, id: prev.length + 1 } : msg
                                )
                            );
                        })
                    input.value = "";
                }}
            >
                <input
                    type="text"
                    name="message"
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring"
                    placeholder="Type your message..."
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Send
                </button>
            </form>
            </div>
        </div>
    );
}