import { useState, useEffect } from 'react';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
  };
  isAnimating?: boolean;
}

export const ChatMessage = ({ message, isAnimating = false }: ChatMessageProps) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isAnimating || message.isUser) {
      setDisplayedContent(message.content);
      return;
    }

    setIsTyping(true);
    setDisplayedContent('');
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < message.content.length) {
        setDisplayedContent(message.content.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 20);

    return () => clearInterval(typingInterval);
  }, [message.content, isAnimating, message.isUser]);

  return (
    <div className={cn(
      "flex w-full mb-6 animate-slide-up",
      message.isUser ? "justify-end" : "justify-start"
    )}>
      {!message.isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 shadow-message transition-all duration-300",
        message.isUser 
          ? "bg-gradient-primary text-user-message-foreground ml-auto" 
          : "bg-ai-message text-ai-message-foreground border border-glass-border"
      )}>
        <div className="whitespace-pre-wrap break-words">
          {displayedContent}
          {isTyping && (
            <span className="inline-block w-2 h-5 bg-primary-glow ml-1 animate-pulse" />
          )}
        </div>
        
        <div className={cn(
          "text-xs mt-2 opacity-60",
          message.isUser ? "text-right" : "text-left"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {message.isUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-8 h-8 rounded-full bg-chat-surface border border-glass-border flex items-center justify-center">
            <User className="w-4 h-4 text-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};