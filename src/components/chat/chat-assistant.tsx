'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MessageCircle, Mic, Send, Bot, User, X, Loader2, Volume2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { answerTextQueryWithVoice, answerVoiceQuery } from '@/lib/actions';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';
import { useChat } from '@/hooks/use-chat';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';


type Message = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  audioUri?: string;
};

export default function ChatAssistant() {
  const { isOpen, setIsOpen } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
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

  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isOpen]);

  const playAudio = (audioUri: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUri;
      audioRef.current.play().catch(e => console.error("Audio playback failed", e));
    }
  };

  const handleSend = async () => {
    const userQuery = input;
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
      // if (result.spokenResponseDataUri) {
      //   playAudio(result.spokenResponseDataUri);
      // }
    } else {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        text: result.error || t('chat.default_error'),
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsProcessing(false);
  };
  
   const handleMicClick = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      setIsProcessing(true);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            await handleVoiceSend(base64Audio);
            // Clean up the stream
            stream.getTracks().forEach(track => track.stop());
          };
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Microphone access denied:", error);
        alert("Microphone access is required for voice input. Please enable it in your browser settings.");
      }
    }
  };

  const handleVoiceSend = async (audioDataUri: string) => {
    setIsProcessing(true);

    const result = await answerVoiceQuery(audioDataUri);
    
    if (result.success && result.textQuery && result.textResponse) {
      const newUserMessage: Message = { id: Date.now(), role: 'user', text: result.textQuery };
      const newAssistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        text: result.textResponse,
        audioUri: result.spokenResponseDataUri,
      };
      setMessages(prev => [...prev, newUserMessage, newAssistantMessage]);
      // if (result.spokenResponseDataUri) {
      //   playAudio(result.spokenResponseDataUri);
      // }
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


  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[500px] h-[80vh] sm:h-[70vh] flex flex-col p-0 gap-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Bot className="text-primary" /> {t('chat.title')}
            </DialogTitle>
            <DialogDescription>{t('chat.description')}</DialogDescription>
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
                <div key={message.id} className={cn("flex items-end gap-3", message.role === 'user' ? "justify-end" : "justify-start")}>
                  {message.role === 'assistant' && (
                    <Avatar className='w-8 h-8'>
                        <AvatarFallback><Bot size={20} /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn("rounded-lg px-3 py-2 max-w-[80%]", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                  {message.role === 'assistant' && message.audioUri && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => playAudio(message.audioUri!)}
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('chat.play_audio')}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                   {message.role === 'user' && (
                    <Avatar className='w-8 h-8'>
                        <AvatarFallback><User size={20} /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {(isProcessing || isRecording) && (
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
           <DialogFooter className="p-4 border-t">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2 w-full">
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
                {isProcessing && !isRecording ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div
        className="fixed bottom-6 right-6 z-50 animate-float-around"
        onClick={() => setIsOpen(true)}
      >
        <div className="absolute inset-0.5 rounded-full border-2 border-primary/50 animate-spin-slow"></div>
        <Button
          className="relative h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90 animate-glow"
          size="icon"
        >
          <MessageCircle className="h-8 w-8 text-primary-foreground" />
        </Button>
      </div>

      <audio ref={audioRef} className="hidden" />
    </>
  );
}
