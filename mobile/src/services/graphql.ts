import { apiFetch } from "./api";

export type GraphQLError = {
  message: string;
};

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const gqlId = Math.random().toString(36).substring(7);
  const queryName = query.match(/(?:query|mutation)\s+([\w]+)/)?.[1] || 'Unknown';
  console.log(`\n[GQL ${gqlId}] 📋 GraphQL ${queryName} request`);
  
  const queryPreview = query.substring(0, 50).replace(/\n/g, ' ');
  console.log(`[GQL ${gqlId}] 📝 Query: ${queryPreview}...`);
  
  if (variables && Object.keys(variables).length > 0) {
    console.log(`[GQL ${gqlId}] 🔧 Variables:`, variables);
  }
  
  const startTime = Date.now();
  const response = await apiFetch("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`[GQL ${gqlId}] ❌ GraphQL request failed: ${response.status}`);
    console.error(`[GQL ${gqlId}] 📄 Response:`, text.substring(0, 200));
    throw new Error(text || "GraphQL request failed");
  }

  const duration = Date.now() - startTime;
  const payload = (await response.json()) as {
    data?: T;
    errors?: GraphQLError[];
  };

  if (payload.errors?.length) {
    console.error(`[GQL ${gqlId}] ❌ GraphQL errors:`, payload.errors);
    throw new Error(payload.errors.map((e) => e.message).join("\n"));
  }

  if (!payload.data) {
    console.error(`[GQL ${gqlId}] ❌ No data in response`);
    throw new Error("No data returned from GraphQL");
  }
  
  console.log(`[GQL ${gqlId}] ✅ Success (${duration}ms)`);
  return payload.data;
}
