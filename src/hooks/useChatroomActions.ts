import { toast } from "sonner";
import { useChatStore } from "@/lib/stores/chat-store";

export const useChatroomActions = () => {
  const { deleteChatroom, createChatroom } = useChatStore();

  const handleDeleteChatroom = (
    id: string,
    title: string,
    e?: React.MouseEvent
  ) => {
    e?.stopPropagation();
    deleteChatroom(id);

    toast.success("Chatroom Deleted", {
      description: `"${title}" has been deleted.`,
    });
  };

  const handleCreateChatroom = async (
    title: string,
    onSuccess?: (id: string) => void
  ) => {
    const id = await createChatroom(title.trim());

    toast.success("Chatroom Created", {
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
