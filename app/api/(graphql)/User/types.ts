import { Field, ObjectType } from "type-graphql";

@ObjectType("User")
export class User {
  @Field()
  id: number;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => Number, { nullable: true })
  dateOfBirth: Date | null;

  @Field(() => Number, { nullable: true })
  placeOfBirthLat: number | null;

  @Field(() => Number, { nullable: true })
  placeOfBirthLong: number | null;

  @Field(() => Number, { nullable: true })
  timezone: number | null;
}
