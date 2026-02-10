import { QueryLibrary } from "naystack/graphql";
import submitFeedback from "./resolvers/submit-feedback";

export const FeedbackResolvers = QueryLibrary({
  submitFeedback,
});
