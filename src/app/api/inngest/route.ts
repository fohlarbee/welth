import { inngest } from "@/inngest/client";
import { createNewUser } from "@/inngest/functions";
import { serve } from "inngest/next";

export const runtime = "edge";
// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  streaming:'allow',
  functions: [
    createNewUser,
  ],
});
