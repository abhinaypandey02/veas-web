import { field } from "naystack/graphql";
import type { UserDB } from "../db";

export default field(
  async (user: UserDB) => {
    // Check if all required onboarding fields are set
    return (
      user.name !== null &&
      user.name !== undefined &&
      user.dateOfBirth !== null &&
      user.dateOfBirth !== undefined &&
      user.placeOfBirthLat !== null &&
      user.placeOfBirthLat !== undefined &&
      user.placeOfBirthLong !== null &&
      user.placeOfBirthLong !== undefined &&
      user.timezone !== null &&
      user.timezone !== undefined
    );
  },
  {
    output: Boolean,
  },
);
