import { Field, ObjectType, registerEnumType } from "type-graphql";
import { ChatRole } from "./db";

@ObjectType("Chat")
export class Chat {
  @Field(() => String)
  message: string;

  @Field(() => ChatRole)
  role: ChatRole;

  @Field(() => Date)
  createdAt: Date;
}

registerEnumType(ChatRole, {
  name: "ChatRole",
});
