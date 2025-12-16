import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `From this prescription text, extract ONLY the medicine/tablet names. Return as a JSON array of strings. Do not include dosages, frequencies, or symptoms using the format ["Medicine1", "Medicine2"]. Text: ${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        console.log("Gemini Raw Response:", textResponse);

        // Extract JSON array from Markdown code blocks if present
        let jsonString = textResponse;
        const jsonMatch = textResponse.match(/\[.*\]/s);
        if (jsonMatch) {
            jsonString = jsonMatch[0];
        }

        let medicines = [];
        try {
            medicines = JSON.parse(jsonString);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            // Fallback: split by newlines if it looks like a list
            medicines = textResponse.split('\n').filter(line => line.trim().length > 0);
        }

        return NextResponse.json({ medicines });
    } catch (error) {
        console.error('Gemini API Error:', error);
        return NextResponse.json({ error: 'Failed to process with Gemini' }, { status: 500 });
    }
}
