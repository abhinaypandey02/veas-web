import { apiFetch } from "./api";

export type GraphQLError = {
  message: string;
};

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await apiFetch("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "GraphQL request failed");
  }

  const payload = (await response.json()) as {
    data?: T;
    errors?: GraphQLError[];
  };

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join("\n"));
  }

  if (!payload.data) {
    throw new Error("No data returned from GraphQL");
  }

  return payload.data;
}
