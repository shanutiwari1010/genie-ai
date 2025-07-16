// lib/hooks/useChatroomActions.ts
import { useToast } from "@/hooks/use-toast";
import { useChatStore } from "@/lib/stores/chat-store";

export const useChatroomActions = () => {
  const { deleteChatroom, createChatroom } = useChatStore();
  const { toast } = useToast();

  const handleDeleteChatroom = (
    id: string,
    title: string,
    e?: React.MouseEvent
  ) => {
    e?.stopPropagation();
    deleteChatroom(id);

    toast({
      title: "Chatroom Deleted",
      description: `"${title}" has been deleted.`,
      variant: "destructive",
    });
  };

  const handleCreateChatroom = async (
    title: string,
    onSuccess?: (id: string) => void
  ) => {
    const id = await createChatroom(title.trim());

    toast({
      title: "Chatroom Created",
      description: `"${title}" has been created successfully.`,
    });

    if (onSuccess) {
      onSuccess(id);
    }
  };

  return {
    handleDeleteChatroom,
    handleCreateChatroom,
  };
};
