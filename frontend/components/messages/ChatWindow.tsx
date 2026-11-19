'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ConversationItem, MessageItem } from './types';

interface ChatWindowProps {
  conversation: ConversationItem;
  onSendMessage?: (conversationId: string, text: string) => void;
}

export default function ChatWindow({ conversation, onSendMessage }: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (onSendMessage) {
      onSendMessage(conversation.id, inputText.trim());
    }
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Active Vendor Header ───────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-200/80">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 border border-gray-100">
            <img
              src={conversation.avatarSrc}
              alt={conversation.vendorName}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1B2430]">
              {conversation.vendorName}
            </h3>
            <p className="text-xs text-[#4B5563]">
              {conversation.category} &middot; {conversation.statusNote}
            </p>
          </div>
        </div>

        <Link
          href={`/client/vendors/${conversation.vendorId}`}
          className="inline-flex items-center justify-center rounded-md border border-[#266665] bg-white px-5 py-2 text-sm font-medium text-[#266665] transition-colors hover:bg-[#266665]/5 no-underline"
        >
          View profile
        </Link>
      </div>

      {/* ── Chat Messages Container ────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Date Divider */}
        <div className="flex justify-center my-2">
          <span className="text-xs text-[#4B5563] font-medium">Mon 19 Oct</span>
        </div>

        {conversation.messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[75%] rounded-md px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#266665] text-white'
                    : 'bg-[#DBECEC]/60 text-[#1B2430]'
                }`}
              >
                {msg.text}
              </div>

              {/* Timestamp */}
              <span className="text-[11px] text-[#4B5563] mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Bottom Input Bar ───────────────────────────────────── */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-gray-200/80 bg-white flex items-center gap-3"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 rounded-md border border-gray-200 px-4 py-2.5 text-sm text-[#1B2430] placeholder-gray-400 focus:outline-none focus:border-[#266665] focus:ring-1 focus:ring-[#266665] transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="inline-flex items-center justify-center rounded-md bg-[#266665] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#123B3A] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}

