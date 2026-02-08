import { Field, ObjectType } from "type-graphql";

@ObjectType("User")
export class User {
  @Field()
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;
}
