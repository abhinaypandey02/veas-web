import getChats from "@/app/api/(graphql)/Chat/resolvers/get-chats";
import { Injector } from "naystack/graphql/server";
import { ChatWindow } from "./components/chat-window";
import getCurrentUser from "@/app/api/(graphql)/User/resolvers/get-current-user";
export default async function ChatPage() {
  return (
    <>
      <Injector
        fetch={async () => {
          const user = await getCurrentUser.authCall();
          const chats = await getChats.authCall();
          return {
            user,
            chats,
          };
        }}
        Component={ChatWindow}
      />
    </>
  );
}
