import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import Note from '@/app/models/Note';

export async function DELETE(req, { params }) {
    try {
        const { id } = params;

        // Connect to the database
        await connectToDatabase();

        // Delete the note by ID
        const deletedNote = await Note.findByIdAndDelete(id);

        // If the note does not exist, return a 404 response
        if (!deletedNote) {
            return NextResponse.json({ message: 'Note not found' }, { status: 404 });
        }

        // Return a 204 status to indicate successful deletion
        return NextResponse.status(204).end();
    } catch (error) {
        // Log the error for debugging
        console.error('Error deleting note:', error);

        // Return a 500 status for server errors
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const { content } = await req.json();

        // Connect to the database
        await connectToDatabase();

        // Update the note by ID
        const updatedNote = await Note.findByIdAndUpdate(id, { content }, { new: true });

        // If the note does not exist, return a 404 response
        if (!updatedNote) {
            return NextResponse.json({ message: 'Note not found' }, { status: 404 });
        }

        // Return the updated note with a 200 status
        return NextResponse.json(updatedNote, { status: 200 });
    } catch (error) {
        // Log the error for debugging
        console.error('Error updating note:', error);

        // Return a 500 status for server errors
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
