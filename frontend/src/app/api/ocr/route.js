import { NextResponse } from 'next/server';
import Tesseract from 'tesseract.js';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Convert file to buffer for Tesseract
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Recognize text
        const { data: { text, confidence } } = await Tesseract.recognize(
            buffer,
            'eng', // Prescriptions are mostly English/Latin script
            { logger: m => console.log(m) }
        );

        return NextResponse.json({ text, confidence });
    } catch (error) {
        console.error('OCR Error:', error);
        return NextResponse.json({ error: 'Failed to extract text' }, { status: 500 });
    }
}
