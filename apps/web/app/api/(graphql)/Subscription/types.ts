import { registerEnumType } from "type-graphql";
import { SubscriptionType } from "./enum";

registerEnumType(SubscriptionType, {
  name: "SubscriptionType",
});
