import { Bot } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <div className="flex w-full mb-6 justify-start animate-fade-in">
      <div className="flex-shrink-0 mr-3">
        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
      
      <div className="bg-ai-message border border-glass-border rounded-2xl px-4 py-3 shadow-message">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-primary-glow rounded-full animate-typing" />
          <div className="w-2 h-2 bg-primary-glow rounded-full animate-typing" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-primary-glow rounded-full animate-typing" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};