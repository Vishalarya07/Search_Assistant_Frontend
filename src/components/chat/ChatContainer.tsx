import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { toast } from '@/hooks/use-toast';
import { Sparkles, MessageSquare, Zap } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatHistory {
  query: string;
  result: any;
}

export const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Bhumi's AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastMessageId, setLastMessageId] = useState<string>('1');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (query: string) => {
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: query,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post('https://searchassistantbackend-production.up.railway.app/api/search', { query });
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2),
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setLastMessageId(aiMessage.id);
      setHistory(prev => [{ query, result: response.data }, ...prev]);

      toast({
        title: "Response received",
        description: "Your query has been processed successfully.",
      });

    } catch (err: any) {
      const errorMessage = err.response?.data || 'Error connecting to backend';
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${errorMessage}`,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setLastMessageId(aiMessage.id);

      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-chat-background">
      {/* Header */}
      <div className="bg-chat-surface/50 backdrop-blur-xl border-b border-glass-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Bhumi's Assistant</h1>
            <p className="text-sm text-muted-foreground">Powered by your Baby</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
            <span>{messages.length} messages</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4" />
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span>Connected</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              isAnimating={message.id === lastMessageId && !message.isUser}
            />
          ))}
          
          {isLoading && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder="Ask me anything about your data..."
      />
    </div>
  );
};