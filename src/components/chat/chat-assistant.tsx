'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MessageCircle, Mic, Send, Bot, User, X, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { answerTextQueryWithVoice } from '@/lib/actions';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  audioUri?: string;
};

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A bit of a hack to scroll to the bottom.
        // Direct scroll manipulation is tricky with ScrollArea component.
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages]);

  const playAudio = (audioUri: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUri;
      audioRef.current.play().catch(e => console.error("Audio playback failed", e));
    }
  };

  const handleSend = async (query?: string) => {
    const userQuery = query || input;
    if (!userQuery.trim() || isProcessing) return;

    const newUserMessage: Message = { id: Date.now(), role: 'user', text: userQuery };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsProcessing(true);

    const result = await answerTextQueryWithVoice(userQuery);

    if (result.success && result.textResponse) {
      const newAssistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        text: result.textResponse,
        audioUri: result.spokenResponseDataUri,
      };
      setMessages(prev => [...prev, newAssistantMessage]);
      if (result.spokenResponseDataUri) {
        playAudio(result.spokenResponseDataUri);
      }
    } else {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        text: result.error || t('chat.default_error'),
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsProcessing(false);
    setIsRecording(false);
  };
  
  const handleMicClick = () => {
    if(isRecording) {
      // Stop recording
      setIsRecording(false);
      setIsProcessing(true);
      // Simulate voice processing and send a canned query
      setTimeout(() => {
        handleSend(t('chat.canned_query'));
      }, 1500);
    } else {
      // Start recording
      setIsRecording(true);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[500px] h-[70vh] flex flex-col p-0 gap-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Bot className="text-primary" /> {t('chat.title')}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
              {messages.length === 0 && (
                <div className='text-center text-muted-foreground pt-10'>
                    <MessageCircle className='mx-auto h-10 w-10 mb-2'/>
                    <p>{t('chat.welcome_message')}</p>
                </div>
              )}
              {messages.map(message => (
                <div key={message.id} className={cn("flex items-start gap-3", message.role === 'user' ? "justify-end" : "justify-start")}>
                  {message.role === 'assistant' && (
                    <Avatar className='w-8 h-8'>
                        <AvatarFallback><Bot size={20} /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn("rounded-lg px-3 py-2 max-w-[80%]", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                   {message.role === 'user' && (
                    <Avatar className='w-8 h-8'>
                        <AvatarFallback><User size={20} /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isProcessing && !isRecording && (
                <div className='flex items-start gap-3 justify-start'>
                    <Avatar className='w-8 h-8'>
                        <AvatarFallback><Bot size={20} /></AvatarFallback>
                    </Avatar>
                    <div className='rounded-lg px-3 py-2 bg-secondary'>
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={isRecording ? t('chat.input_listening') : t('chat.input_placeholder')}
                disabled={isProcessing || isRecording}
              />
              <Button type="button" size="icon" variant={isRecording ? "destructive" : "secondary"} onClick={handleMicClick} disabled={isProcessing}>
                <Mic className="h-5 w-5" />
              </Button>
              <Button type="submit" size="icon" disabled={!input.trim() || isProcessing}>
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-8 w-8 text-primary-foreground" />
      </Button>

      <audio ref={audioRef} className="hidden" />
    </>
  );
}
