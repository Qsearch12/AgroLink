import { DashboardLayout } from "@/components/DashboardLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { farmerNavItems } from "@/constants/navigation";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, Phone, MoreVertical, Check, CheckCheck, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { messagesApi, authApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function FarmerMessages() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showList, setShowList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get("with");
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authApi.getMe();
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to fetch user info");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await messagesApi.getConversations();
        setConversations(data);
        
        if (targetUserId) {
          const existing = data.find((c: any) => c.other_user_id === parseInt(targetUserId));
          if (existing) {
            setSelected(existing);
          } else if (!selected) {
            setSelected({
              other_user_id: parseInt(targetUserId),
              other_user_name: "User", 
              last_message: "Start a new conversation",
              unread_count: 0,
              last_message_time: new Date().toISOString()
            });
          }
        } else if (data.length > 0 && !selected) {
          setSelected(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch conversations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [selected, targetUserId]);

  useEffect(() => {
    if (!selected) return;

    const fetchMessages = async () => {
      try {
        const data = await messagesApi.getChatHistory(selected.other_user_id);
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch chat history");
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selected]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selected || isSending) return;

    setIsSending(true);
    try {
      const msg = await messagesApi.sendMessage({
        content: newMessage,
        receiver_id: selected.other_user_id,
      });
      setMessages(prev => [...prev, msg]);
      setNewMessage("");
    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.other_user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading && conversations.length === 0) {
    return (
      <DashboardLayout navItems={farmerNavItems} title="Messages">
        <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={farmerNavItems} title="Messages">
      <ScrollReveal>
        <div className="bg-card rounded-2xl border shadow-xl overflow-hidden flex h-[calc(100vh-12rem)]">
          <div className={`w-80 border-r flex-col shrink-0 ${showList ? "flex" : "hidden"} sm:flex`}>
            <div className="p-4 border-b space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">Chat</h3>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {conversations.filter(c => c.unread_count > 0).length} New
                </span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 rounded-xl border bg-muted/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? filteredConversations.map((conv) => (
                <button
                  key={conv.other_user_id}
                  onClick={() => { setSelected(conv); setShowList(false); }}
                  className={`w-full p-4 text-left border-b last:border-0 hover:bg-primary/5 transition-all ${
                    selected?.other_user_id === conv.other_user_id ? "bg-primary/5 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                        {conv.other_user_name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-card" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-sm truncate ${conv.unread_count > 0 ? "font-bold text-foreground" : "font-medium text-foreground"}`}>{conv.other_user_name}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">{new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className={`text-xs truncate mt-1 ${conv.unread_count > 0 ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                        {conv.last_message}
                      </p>
                    </div>
                    {conv.unread_count > 0 && (
                      <div className="min-w-[1.25rem] h-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center px-1.5 mt-1">
                        {conv.unread_count}
                      </div>
                    )}
                  </div>
                </button>
              )) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">No conversations yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className={`flex-1 flex flex-col ${showList ? "hidden sm:flex" : "flex"} bg-muted/5`}>
            {selected ? (
              <>
                <div className="p-4 border-b bg-card flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <button className="sm:hidden p-2 -ml-2 text-muted-foreground" onClick={() => setShowList(true)}>
                      <Search className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                        {selected.other_user_name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground leading-tight">{selected.other_user_name}</p>
                      <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online · {selected.role === 'farmer' ? 'Farmer' : 'Buyer'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>

                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-6 space-y-4"
                >
                  {messages.map((msg, i) => {
                    const isMe = currentUser && msg.sender_id === currentUser.id;
                    return (
                      <div key={msg.id || i} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fade-in`}>
                        <div className={`max-w-[80%] lg:max-w-[70%] group`}>
                          <div className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm relative ${
                            isMe
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-card text-foreground border border-primary/10 rounded-bl-none"
                          }`}>
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            <div className={`flex items-center gap-1.5 justify-end mt-1.5 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                              <span className="text-[9px] font-medium uppercase tracking-tighter">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {isMe && (
                                msg.is_read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 border-t bg-card">
                  <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Write your message..."
                      className="flex-1 h-11 px-5 rounded-full border bg-muted/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={!newMessage.trim() || isSending}
                      className="h-11 w-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all active:scale-90 shrink-0 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100"
                    >
                      {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-primary opacity-40" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Select a conversation</h3>
                <p className="text-sm text-muted-foreground max-w-[240px] mt-1">Choose a chat from the left to start messaging farmers or buyers.</p>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </DashboardLayout>
  );
}
