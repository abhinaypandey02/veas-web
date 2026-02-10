import { Field, ObjectType } from "type-graphql";

@ObjectType("User")
export class User {
  @Field()
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  placeOfBirth?: string;

  @Field({ nullable: true })
  timezoneOffset?: number;

  @Field({ nullable: true })
  dateOfBirth?: Date;

  @Field({ nullable: true })
  placeOfBirthLat?: number;

  @Field({ nullable: true })
  placeOfBirthLong?: number;
}
