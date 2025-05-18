"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  paragraphs?: string[];
  role: "user" | "assistant";
  timestamp: Date;
}

export function ExpandableChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm AlgoBot. Ask me anything about algorithms and visualizations!",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      // Use 'question' instead of 'query' as required by the API
      const requestBody = { question: inputValue };
      console.log('Sending request:', requestBody);
      
      const response = await fetch("https://ae6d-35-223-227-18.ngrok-free.app/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(requestBody),
      });
      
      // Log the response status and headers for debugging
      console.log('Response status:', response.status);
      
      // Log headers in a TypeScript-compatible way
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log('Response headers:', headers);
      
      // If response is not OK, try to get error details
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText || 'No error details'}`);
      }
      
      const data = await response.json();
      console.log('API response:', data); // Log the response for debugging
      
      // Get the response text from the API response
      const rawResponseText = typeof data === 'string' ? data : data.response || data.answer || data.message || JSON.stringify(data);
      
      // Create a structured response with paragraphs
      // We'll use an array of paragraphs instead of newline characters
      const paragraphs: string[] = [];
      
      // Clean up the text first
      const cleanText = rawResponseText.trim();
      
      // Check if the text already has paragraph breaks
      if (cleanText.includes('\n')) {
        // Text already has line breaks, use them as paragraph separators
        paragraphs.push(...cleanText.split(/\n+/).filter((p : string) => p.trim().length > 0).map((p : string) => p.trim()));
      } else {
        // No existing paragraph breaks, we need to create them
        // First try to split by sentences
        const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
        
        if (sentences.length <= 1) {
          // Just one sentence or couldn't parse sentences, add as is
          paragraphs.push(cleanText);
        } else if (sentences.length <= 4) {
          // For 2-4 sentences, create 2 paragraphs
          const midpoint = Math.ceil(sentences.length / 2);
          paragraphs.push(
            sentences.slice(0, midpoint).join(' ').trim(),
            sentences.slice(midpoint).join(' ').trim()
          );
        } else {
          // For longer texts, create 3 or more paragraphs
          const paragraphSize = Math.ceil(sentences.length / 3);
          
          for (let i = 0; i < sentences.length; i += paragraphSize) {
            const paragraphSentences = sentences.slice(i, i + paragraphSize);
            paragraphs.push(paragraphSentences.join(' ').trim());
          }
        }
      }
      
      // Ensure we have at least one paragraph
      if (paragraphs.length === 0) {
        paragraphs.push(cleanText || "I couldn't generate a response.");
      }
      
      // Add assistant response to chat
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: rawResponseText, // Keep original content for reference
        paragraphs: paragraphs,   // Add structured paragraphs
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, I encountered an error. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "rounded-full w-14 h-14 shadow-lg transition-all duration-300",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-purple-500 hover:bg-purple-600"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat panel */}
      <div
        className={cn(
          "absolute bottom-16 right-0 w-80 md:w-96 rounded-lg shadow-xl transition-all duration-300 transform origin-bottom-right",
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <div className="flex flex-col h-[500px] bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          {/* Chat header */}
          <div className="p-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold text-white">AlgoBot</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2 max-w-[85%]",
                    message.role === "user" ? "ml-auto" : "mr-auto"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-purple-400" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-lg p-3",
                      message.role === "user"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-800 text-gray-100"
                    )}
                  >
                    {message.paragraphs ? (
                      // Display structured paragraphs if available
                      message.paragraphs.map((paragraph, i) => (
                        <p key={i} className={cn("text-sm", i > 0 && "mt-3")}>
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      // Fallback to original content if paragraphs not available
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 max-w-[85%] mr-auto">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="rounded-lg p-3 bg-gray-800 text-gray-100">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Chat input */}
          <div className="p-3 bg-gray-800 border-t border-gray-700">
            <div className="flex gap-2">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask something..."
                className="min-h-10 max-h-32 resize-none bg-gray-700 border-gray-600 focus:border-purple-500 text-white"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="h-10 w-10 p-0 bg-purple-500 hover:bg-purple-600"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
