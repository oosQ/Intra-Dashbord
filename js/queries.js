import { getToken, GRAPHQL_URL } from "./auth.js";

export async function fetchQuery(query, variables = {}) {
  const token = getToken();
  if (!token) {
    throw new Error("User is not authenticated. Please log in to access this resource.");
  }

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error("Error fetching data from GraphQL API: " + (result.errors ? result.errors[0].message : response.statusText));
  }

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors[0].message || "Error in GraphQL query");
  }

  return result.data;
}

export const GET_USER_BASIC = `
  query GetUserBasic {
    user {
      id
      login
      firstName
      lastName
      email
      attrs
    }
  }
`;

export const GET_XP_TRANSACTIONS = `
  query GetXPTransactions {
    transaction(
      where: { type: { _eq: "xp" }, object: { type: { _eq: "project" } } }
      order_by: { createdAt: asc }
    ) {
      id
      amount
      createdAt
      object {
        name
        type
      }
    }
  }
`;

export const GET_RESULTS = `
  query GetResults {
    result(order_by: { createdAt: desc }) {
      id
      grade
      createdAt
      path
    }
  }
`;