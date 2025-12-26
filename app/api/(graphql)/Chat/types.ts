import { Field, ObjectType, registerEnumType } from "type-graphql";
import { ChatRole } from "./db";

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
