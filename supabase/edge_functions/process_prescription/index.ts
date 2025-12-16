import { serve } from "https://deno.land/std/http/server.ts";
import { extractText } from "./googleVision.ts";
import { correctText } from "./nlpCorrector.ts";
import { translateText } from "./translator.ts";

serve(async (req) => {
  const { imageBase64 } = await req.json();

  const rawText = await extractText(imageBase64);
  const corrected = await correctText(rawText);
  const translated = await translateText(corrected);

  return new Response(
    JSON.stringify({
      extracted_text: rawText,
      corrected_text: corrected,
      translated_text: translated
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
