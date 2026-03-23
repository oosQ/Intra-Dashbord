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

export const GET_USER_LEVEL = `
  query GetUserLevel {
    transaction(
      order_by: { amount: desc }
      limit: 1
      where: { type: { _eq: "level" }, path: { _like: "/bahrain/bh-module%" } }
    ) {
      amount
    }
  }
`;

export const GET_XP_TRANSACTIONS = `
  query GetXPTransactions {
    transaction(

      where: {
        type: { _eq: "xp" }
        _or: [
          { object: { type: { _eq: "project" } } }
          { _and: [
              { object: { type: { _eq: "exercise" } } }
              { path: { _ilike: "%/checkpoint/%" } }
            ]
          }
          { path: { _regex: "/bahrain/bh-module/piscine-(js|rust)$" } }
        ]
      }

      order_by: { createdAt: asc }
    ) {
      id
      amount
      createdAt
      path
      object {
        name
        type
      }
    }
  }
`;

export const GET_XP_PROJECTS = `
  query GetXPProjects {
    transaction(
      where: {
        type: { _eq: "xp" }
        object: { type: { _eq: "project" } }
        path: { _like: "/bahrain/bh-module/%" }
      }
      order_by: { createdAt: asc }
    ) {
      id
      amount
      createdAt
      object {
        name
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

export const GET_AUDIT_RATIO = `
  query GetAuditRatio {
    user {
      auditRatio
      totalUp
      totalUpBonus
      totalDown
    }
  }
`;

export const QUERIES = {
  userDetails : GET_USER_BASIC,
  userAllXP : GET_XP_TRANSACTIONS,
  xpProjects : GET_XP_PROJECTS,
  results : GET_RESULTS,
  auditRatio : GET_AUDIT_RATIO,
  userLevel : GET_USER_LEVEL
} 