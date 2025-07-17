import type { Message } from "@/lib/stores/chat-store";

export function generateDummyMessages(count =0): Message[] {
  const now = Date.now();

  return Array.from({ length: count }, (_, i) => {
    const isUser = i % 2 === 0;
    return {
      id: `msg-${i}`,
      content: isUser
        ? `User dummy message #${i + 1}`
        : `Assistant response to message #${i}`,
      role: isUser ? "user" : "assistant",
      timestamp: new Date(now - (count - i) * 60000),
      reactions: [], 
      replies: [],   
    };
  });
}
