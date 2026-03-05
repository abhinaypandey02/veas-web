import { Field, ObjectType, registerEnumType } from "type-graphql";
import { ChatRole } from "./db";
import { ChatStreamRole } from "@/app/api/(graphql)/Chat/enum";

@ObjectType("Chat")
export class Chat {
  @Field()
  message: string;

  @Field(() => ChatRole)
  role: ChatRole;

  @Field(() => Number)
  createdAt: Date;
}

registerEnumType(ChatRole, {
  name: "ChatRole",
});

registerEnumType(ChatStreamRole, {
  name: "ChatStreamRole",
});
