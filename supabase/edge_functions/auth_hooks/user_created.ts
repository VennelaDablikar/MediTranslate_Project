import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const payload = await req.json();
  console.log("New user created:", payload);
  return new Response("OK");
});
