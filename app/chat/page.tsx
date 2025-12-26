import { GET_CHATS } from "@/constants/graphql/queries";
import { query } from "../lib/gql-server";
import { ChatWindow } from "./components/chat-window";

export default async function ChatPage() {
  const data = await query(GET_CHATS);
  return <ChatWindow previousChats={data.getChats} />;
}
