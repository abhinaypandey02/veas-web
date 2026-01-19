import { GET_CHATS } from "@/constants/graphql/queries";
import { ChatWindow } from "./components/chat-window";
import { query } from "naystack/graphql/server";

export default async function ChatPage() {
  const data = await query(GET_CHATS);
  return <ChatWindow previousChats={data.getChats} />;
}
