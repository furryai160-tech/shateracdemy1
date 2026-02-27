'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Send, User as UserIcon } from 'lucide-react';
import { fetchAPI } from '../../lib/api';

interface Message {
    id: string;
    user_id: string;
    user_name: string;
    content: string;
    created_at: string;
    is_admin?: boolean;
}

interface LiveChatProps {
    sessionId: string;
}

export function LiveChat({ sessionId }: LiveChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load User
        const loadUser = async () => {
            try {
                const userData = await fetchAPI('/auth/profile');
                setUser(userData);
            } catch (err) {
                console.error('Failed to load user', err);
            }
        };
        loadUser();
    }, []);

    useEffect(() => {
        // Fetch initial messages
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('live_chat_messages')
                .select('*')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: true })
                .limit(100);

            if (data) setMessages(data as Message[]);
        };

        fetchMessages();

        // Subscribe to new messages using Supabase Realtime
        const channel = supabase
            .channel(`live_chat_${sessionId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'live_chat_messages',
                    filter: `session_id=eq.${sessionId}`,
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new as Message]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [sessionId]);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        const messageContent = newMessage;
        setNewMessage(''); // optimistic clear

        try {
            const { error } = await supabase.from('live_chat_messages').insert([
                {
                    session_id: sessionId,
                    user_id: user.id,
                    user_name: user.name || 'طالب',
                    content: messageContent,
                    is_admin: user.role === 'TEACHER' || user.role === 'SUPER_ADMIN',
                },
            ]);
            if (error) throw error;
        } catch (err) {
            console.error('Error sending message:', err);
            // Could restore the message if failed
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden" dir="rtl">
            {/* Chat Header */}
            <div className="bg-slate-800 p-4 border-b border-slate-700">
                <h3 className="text-white font-bold flex items-center gap-2">
                    الدردشة المباشرة
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                        لا توجد رسائل حتى الآن. كن أول من يرسل في الدردشة!
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="flex flex-col gap-1 w-full animate-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-2">
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full ${msg.is_admin ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                                    <UserIcon size={12} className="text-white" />
                                </div>
                                <span className={`text-xs font-medium ${msg.is_admin ? 'text-indigo-400' : 'text-slate-400'}`}>
                                    {msg.user_name}
                                    {msg.is_admin && <span className="mr-1 text-xs bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-300">معلم</span>}
                                </span>
                            </div>
                            <div className="text-sm text-slate-200 mr-8 bg-slate-800 px-3 py-2 rounded-xl rounded-tr-sm inline-block w-fit max-w-[90%] break-words">
                                {msg.content}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-slate-800/50 border-t border-slate-700">
                <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
                        placeholder="اكتب رسالتك هنا..."
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || !user}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors absolute left-1 top-0.5"
                    >
                        <Send size={16} className="-ml-1" />
                    </button>
                </form>
            </div>
        </div>
    );
}
