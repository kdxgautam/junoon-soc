import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  withCredentials: true,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})



