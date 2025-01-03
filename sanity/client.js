import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "8mhyf2un",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})
