import { Field, ObjectType } from "type-graphql";

@ObjectType("User")
export class User {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => Date, { nullable: true })
  dateOfBirth: Date | null;

  @Field(() => Number, { nullable: true })
  placeOfBirthLat: number | null;

  @Field(() => Number, { nullable: true })
  placeOfBirthLong: number | null;

  @Field(() => Number, { nullable: true })
  timezoneOffset: number | null;

  @Field(() => String, { nullable: true })
  placeOfBirth: string | null;

  @Field(() => Boolean)
  isOnboarded: boolean;
}
