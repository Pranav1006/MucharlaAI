"use client"

import React from "react";

export default function ChatBox() {
    const [messages, setMessages] = React.useState([
        { id: 1, sender: "user", text: "Hello! How are you?" },
        { id: 2, sender: "bot", text: "I'm good, thank you! How can I help you today?" },
        { id: 3, sender: "user", text: "Can you tell me a joke?" },
        { id: 4, sender: "bot", text: "Why did the developer go broke? Because he used up all his cache!" },
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