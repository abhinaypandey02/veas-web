import getChats from "@/app/api/(graphql)/Chat/resolvers/get-chats";
import { Injector } from "naystack/graphql/server";
import { ChatWindow } from "./components/chat-window";
export default async function ChatPage() {
  return (
    <>
      <Injector
        fetch={() => {
          return getChats.authCall();
        }}
        Component={ChatWindow}
      />
    </>
  );
}
