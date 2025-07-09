import { useState, KeyboardEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const ChatInput = ({ onSendMessage, isLoading, placeholder = "Ask me anything..." }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 bg-chat-background/80 backdrop-blur-xl border-t border-glass-border p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-input-background border border-input-border rounded-2xl shadow-input transition-all duration-300 focus-within:border-input-focus focus-within:shadow-glow">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className={cn(
              "w-full bg-transparent border-0 resize-none outline-none px-6 py-4 pr-16",
              "placeholder:text-muted-foreground text-foreground",
              "min-h-[60px] max-h-[200px]",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            rows={1}
            style={{
              height: 'auto',
              minHeight: '60px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 200) + 'px';
            }}
          />
          
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2",
              "w-10 h-10 rounded-xl bg-gradient-primary",
              "flex items-center justify-center",
              "transition-all duration-300 hover:scale-105",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              "shadow-glow hover:shadow-[0_0_40px_hsl(262_83%_58%/0.6)]"
            )}
          >
            {isLoading ? (
              <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse" />
            ) : (
              <Send className="w-4 h-4 text-primary-foreground" />
            )}
          </button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center mt-2">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};