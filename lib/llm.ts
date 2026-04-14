import OpenAI from "openai";
import { ContextMessage } from "./context";

// OpenAI-compatible client pointed at LM Studio's local server.
// dangerouslyAllowBrowser: true is required because this runs in the browser.
const client = new OpenAI({
  baseURL: "http://127.0.0.1:1234/v1",
  apiKey: "lm-studio", // LM Studio doesn't check this, any string works
  dangerouslyAllowBrowser: true,
});

const MODEL = "google/gemma-4-e4b"; // change this if you swap models in LM Studio

// Sends the assembled context to the LLM and returns the reply as a string.
// `async` + `Promise<string>` means: this waits for the network, then gives back a string.
// `?? ""` means: if content is null, return empty string instead.
export async function callLLM(messages: ContextMessage[]): Promise<string> {
  const response = await client.chat.completions.create({
    model: MODEL,
    messages,
  });
  return response.choices[0].message.content ?? "";
}
