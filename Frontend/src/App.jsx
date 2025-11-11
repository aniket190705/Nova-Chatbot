import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [waitingOnResponse, setWaitingOnResponse] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [error, setError] = useState(false);
  const chatEndRef = useRef(null);

  const mockOpeningMessage =
    "👋 Hello! I'm Nova, your official AI Assistant for NovaTech Solutions. I help employees like you find accurate answers about company policies, HR, IT, benefits, leave, and internal processes. I use the official company handbook as my source of information. What would you like to know today?";

  const errorMessage = "⚠️ There was an error. Please try again.";

  useEffect(() => {
    addBotMessage(mockOpeningMessage);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showTyping]);

  const sendMessage = async (message) => {
    if (waitingOnResponse || message.trim() === "") return;

    const userMessage = { role: "user", body: message };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setWaitingOnResponse(true);
    setShowTyping(true);

    try {
      const response = await fetch("http://localhost:8000/runFlow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const result = await response.json();

      if (response.ok) {
        addBotMessage(result.result);
      } else {
        setError(true);
        addBotMessage(errorMessage);
      }
    } catch (err) {
      console.error(err);
      setError(true);
      addBotMessage(errorMessage);
    } finally {
      setWaitingOnResponse(false);
    }
  };

  const addBotMessage = (text) => {
    setTimeout(() => {
      setShowTyping(false);
      const botMessage = { role: "assistant", body: text };
      setMessages((prev) => [...prev, botMessage]);
      setError(false);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !waitingOnResponse) sendMessage(newMessage);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm shadow-md">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-wide text-gray-800">
            Nova<span className="text-teal-600">Assistant</span>
          </h1>
          <a
            href="./company_handbook.pdf"
            download
            type="pdf"
            className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-medium rounded-md shadow-sm hover:from-blue-500 hover:to-teal-400 transition-all"
          >
            📘 Download Handbook
          </a>
        </div>

        <a
          href="https://github.com/aniket190705/InsightFactor"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-teal-600 transition"
        >
          GitHub Repo
          <img
            src="/images/github-mark-white.png"
            alt="GitHub"
            className="w-4 h-4 invert"
          />
        </a>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-5 py-5 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs sm:max-w-md md:max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-blue-600 to-teal-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
              }`}
            >
              {msg.body}
            </div>
          </div>
        ))}

        {showTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl text-sm text-gray-400 rounded-bl-none flex gap-1 shadow-sm">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </main>

      {/* Input Bar */}
      <div className="flex items-center gap-3 p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={() => sendMessage(newMessage)}
          disabled={waitingOnResponse}
          className="px-5 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-medium rounded-lg shadow-sm disabled:opacity-50 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
