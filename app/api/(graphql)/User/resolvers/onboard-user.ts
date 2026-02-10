import { query } from "naystack/graphql";
import { InputType, Field } from "type-graphql";
import { createUserChart } from "./create-user-chart";

@InputType("OnboardUserInput")
export class OnboardUserInput {
  @Field()
  dateOfBirth: Date;

  @Field()
  placeOfBirthLat: number;

  @Field()
  placeOfBirthLong: number;

  @Field()
  timezone: number;
}

export default query(
  async (_, input: OnboardUserInput) => {
    return createUserChart({
      lat: input.placeOfBirthLat,
      long: input.placeOfBirthLong,
      dob: input.dateOfBirth,
      timezone: input.timezone,
    });
  },
  {
    mutation: true,
    input: OnboardUserInput,
    output: Number,
  },
);
