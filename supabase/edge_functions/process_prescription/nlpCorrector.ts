export async function correctText(text: string): Promise<string> {
  return text.replace("Pan D", "Pan-D");
}
