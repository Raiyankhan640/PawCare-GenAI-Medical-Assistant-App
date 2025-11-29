"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  getUserConversations,
  createNewConversation,
  deleteConversation,
} from "@/actions/petchat";
import { formatDistanceToNow } from "date-fns";

export default function ConversationSidebar({
  currentConversationId,
  onConversationSelect,
  onNewConversation
}) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const result = await getUserConversations();
      if (result.success) {
        setConversations(result.conversations);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const result = await createNewConversation();
      if (result.success) {
        await loadConversations();
        onNewConversation(result.conversation.id);
        toast.success("New conversation started");
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
      toast.error("Failed to create conversation");
    }
  };

  const handleDelete = async (conversationId, e) => {
    e.stopPropagation();

    if (!confirm("Delete this conversation?")) return;

    try {
      await deleteConversation(conversationId);
      await loadConversations();

      // If deleted current conversation, create new one
      if (conversationId === currentConversationId) {
        await handleNewChat();
      }

      toast.success("Conversation deleted");
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      toast.error("Failed to delete conversation");
    }
  };

  return (
    <div className="w-64 bg-gradient-to-br from-emerald-950/40 to-teal-950/40 border-r border-emerald-500/20 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-emerald-500/20">
        <Button
          onClick={handleNewChat}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
          </div>
        ) : conversations.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">
            No conversations yet
          </p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                conv.id === currentConversationId
                  ? "bg-emerald-500/20 border border-emerald-500/40"
                  : "hover:bg-emerald-500/10 border border-transparent"
              }`}
              onClick={() => onConversationSelect(conv.id)}
            >
              <MessageSquare className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {conv.title || "New Chat"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                onClick={(e) => handleDelete(conv.id, e)}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
