// app/api/notes/route.js
// app/api/notes/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import Note from '@/app/models/Note';


export async function GET() {
    await connectToDatabase();
    const notes = await Note.find({});
    return NextResponse.json(notes);
}

export async function POST(req) {
    await connectToDatabase();
    const body = await req.json();
    const note = await Note.create(body);
    return NextResponse.json(note, { status: 201 });
}
