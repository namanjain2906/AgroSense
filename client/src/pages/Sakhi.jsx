import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const initialMessages = [
  {
    id: 1,
    sender: "assistant",
    text: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ കൃഷി സഹായിയായ Krishi Sakhi ആണ്. കൃഷിയുമായി ബന്ധപ്പെട്ട് എന്തെങ്കിലും അറിയണമെങ്കിൽ ഇവിടെ ചോദിക്കൂ.",
  },
];

const Sakhi = () => {
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);



  async function handleSend() {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: input,
    };
    setInput("")
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        method: "POST",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `${input} in malayalam language`,
                },
              ],
            },
          ],
        },
      });
      const reply =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't find an answer.";
      const botMessage = {
        id: messages.length + 2,
        sender: "assistant",
        text: reply,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage = {
        id: messages.length + 2,
        sender: "assistant",
        text:
          "Error: " + (error.response?.data?.error?.message || error.message),
      };
      setMessages((prev) => [...prev, botMessage]);
    }
    setInput("");
  }
  return (
    <div className="min-h-screen text-black p-20 flex items-center justify-center sm:p-8">
      <div className="w-full  mx-auto shadow-lg rounded-xl m-15 sm:p-8 bg-green-400/40 font-sans">
        <h2 className="text-center text-white text-2xl font-bold mb-6">Krishi Sakhi AI Assistant</h2>

        <div className="h-80 overflow-y-auto border border-gray-200 bg-white rounded-lg p-4 mb-4 flex flex-col gap-2">
          {messages.map(({ id, sender, text }) => (
            <div
              key={id}
              className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl whitespace-pre-wrap leading-relaxed text-[15px] shadow-sm ${
                  sender === "user"
                    ? "bg-blue-100 text-gray-800"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <textarea
          rows={3}
          placeholder="Type your question in Malayalam or English..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 resize-none rounded-lg border border-gray-300 text-[15px] bg-white font-sans focus:outline-none focus:ring-2 focus:ring-green-400 mb-2"
        />

        <button
          onClick={handleSend}
          className="mt-2 w-full py-3 rounded-lg bg-green-600 text-white font-semibold text-lg transition-colors duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Sakhi;
