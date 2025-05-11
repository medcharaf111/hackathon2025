"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send } from "lucide-react"
import React from "react"

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "Bonjour ! Je suis votre assistant virtuel pour le développement durable. Comment puis-je vous aider aujourd'hui ?",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const newMessages = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    // Call backend chatbot API
    try {
      const res = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      })
      const data = await res.json()
      setMessages([
        ...newMessages,
        { role: "system", content: data.reply }
      ])
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "system", content: "Erreur lors de la communication avec le serveur." }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 bg-green-600 hover:bg-green-700 shadow-lg flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        <span className="sr-only">{isOpen ? "Fermer le chat" : "Ouvrir le chat"}</span>
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 sm:w-96 shadow-xl border border-gray-200 flex flex-col z-50 max-h-[500px]">
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Assistant Virtuel</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-green-700 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-end gap-2">
                  {message.role === "system" && (
                    <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-base">🤖</div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md text-base whitespace-pre-line
                      ${message.role === "user"
                        ? "bg-green-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none border border-green-100"}
                    `}
                  >
                    {message.content}
                  </div>
                  {message.role === "user" && (
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-base">🧑</div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-base">🤖</div>
                  <div className="max-w-[80%] rounded-2xl px-4 py-3 shadow-md text-base bg-gray-100 text-gray-800 rounded-bl-none border border-green-100 animate-pulse">
                    <span>Assistant is typing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" size="icon" className="bg-green-600 hover:bg-green-700" disabled={loading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Envoyer</span>
            </Button>
          </form>
        </Card>
      )}
    </>
  )
}
