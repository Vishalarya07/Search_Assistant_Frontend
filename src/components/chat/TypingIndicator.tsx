import { Loader2 } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <div className="flex w-full justify-center my-6 animate-fade-in">
      <div className="flex flex-col items-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
        <div className="text-base text-muted-foreground font-medium">Thinking...</div>
      </div>
    </div>
  );
};