'use client'

import { useState } from "react";

export default function ChatPrompt() {
    const [userPrompt, setUserPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(userPrompt);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label
            htmlFor="prompt"
            className="border border-black bg-gray-200 rounded px-2 py-1 mr-2 inline-block"
            >
            Type prompt here:
            </label>
            <input
            type="text"
            name="prompt"
            id="prompt"
            value={userPrompt}
            onChange={e => setUserPrompt(e.target.value)}
            className="border border-black bg-gray-200 rounded px-2 py-1 mr-2"
            />
            <input
            type="submit"
            value="Enter"
            className="border border-black bg-gray-200 rounded px-4 py-1 cursor-pointer"
            />
        </form>
    );
}