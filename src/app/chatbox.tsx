"use client"

import React from "react";

export default function ChatBox() {
    const [messages, setMessages] = React.useState([
        { id: 1, sender: "bot", text: "Welcome to AI!" },
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
                        {msg.text}
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
                    setMessages(prev => [
                        ...prev,
                        {
                            id: prev.length + 1,
                            sender: "user",
                            text,
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
                            if (!res.ok || data.error) {
                                setMessages(prev => [
                                    ...prev,
                                    {
                                        id: prev.length + 1,
                                        sender: "bot",
                                        text: "There was an error contacting the AI.",
                                    },
                                ]);
                            } else {
                                setMessages(prev => [
                                    ...prev,
                                    {
                                        id: prev.length + 1,
                                        sender: "bot",
                                        text: data.response || "Sorry, I didn't understand that.",
                                    },
                                ]);
                            }
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