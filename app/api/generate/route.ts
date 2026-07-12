import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

const openai = createOpenAI({
  baseURL: `${process.env.CODEWORDS_RUNTIME_URI}/run/openai/v1`,
  apiKey: process.env.CODEWORDS_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    if (!description || typeof description !== 'string') {
      return Response.json({ error: 'Please provide a description.' }, { status: 400 });
    }

    if (description.length > 2000) {
      return Response.json({ error: 'Description too long.' }, { status: 400 });
    }

    const systemPrompt = `You are an expert web developer. Generate a complete HTML page with inline CSS/JS. Use modern design. Output ONLY <!DOCTYPE html>.`;

    const { text } = await generateText({
      model: openai('gpt-4.1-mini'),
      system: systemPrompt,
      prompt: `Create HTML for: "${description}"`,
    });

    let html = text.trim();
    if (html.startsWith('`l`html')) html = html.slice(7);
    else if (html.startsWith('`l``')) html = html.slice(3);
    if (html.endsWith('```')) html = html.slice(0, -3);
    html = html.trim();
    if (!html.startsWith('<!DOCTYPE') && !html.startsWith('<html')) html = '<!DOCTYPE html>\n' + html;

    const title = description.length > 60 ? description.slice(0, 57) + '...' : description;
    const encodedHtml = Buffer.from(html).toString('base64');

    return Response.json({ url: `data:text/html;base64,${encodedHtml}`, html, title });
  } catch (error: any) {
    console.error('Generation error:', error);
    return Response.json({ error: error.message || 'Generation failed' }, { status: 500 });
  }
}
