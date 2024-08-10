'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

export default function Home() {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [editingNote, setEditingNote] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [expandedNote, setExpandedNote] = useState(null); // Track which note is expanded

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await axios.get('/api/notes');
            setNotes(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error.response ? error.response.data : error.message);
        }
    };

    const addNote = async () => {
        if (!newNote.trim()) return;
        try {
            const response = await axios.post('/api/notes', { content: newNote });
            setNewNote('');
            setNotes([...notes, response.data]); // Append new note to the list
        } catch (error) {
            console.error('Error adding note:', error.response ? error.response.data : error.message);
        }
    };

    const deleteNote = async (id) => {
        try {
            setNotes(notes.filter(note => note._id !== id));
            await axios.delete(`/api/notes/${id}`);
        } catch (error) {
            console.error('Error deleting note:', error.response ? error.response.data : error.message);
            fetchNotes();
        }
    };

    const updateNote = async (id) => {
        if (!editContent.trim()) return;
        try {
            await axios.put(`/api/notes/${id}`, { content: editContent });
            setNotes(notes.map((note) => note._id === id ? { ...note, content: editContent } : note)); // Update note content
            setEditingNote(null);
            setEditContent('');
        } catch (error) {
            console.error('Error updating note:', error.response ? error.response.data : error.message);
        }
    };

    const startEdit = (note) => {
        setEditingNote(note._id);
        setEditContent(note.content);
    };

    const toggleExpand = (id) => {
        setExpandedNote(expandedNote === id ? null : id); // Toggle expand/collapse
    };

    const truncateContent = (content) => {
        const words = content.split(' ');
        return words.length > 5 ? words.slice(0, 5).join(' ') + '...' : content;
    };
    return (
        <div className="outer-container">
            <div className="main-navbar">
                <h2>GITHUB</h2>
            </div>
            <div className="container">
                <nav className="navbar">
                    <h1>NOTEPAD</h1>
                </nav>
                <div className="note-input">
                    <textarea
                        placeholder="Write your note here..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                    />
                    <button onClick={addNote}>Add Note</button>
                </div>
                <div className="notes-list">
                    {notes.map((note) => (
                        <div key={note._id} className="note-item">
                            {editingNote === note._id ? (
                                <div className="edit-note">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                    />
                                    <button onClick={() => updateNote(note._id)}>Save</button>
                                    <button onClick={() => setEditingNote(null)}>Cancel</button>
                                </div>
                            ) : (
                                <div className="note-content" onClick={() => toggleExpand(note._id)}>
                                    <p>{expandedNote === note._id ? note.content : truncateContent(note.content)}</p>
                                    <div className="note-actions">
                                        <FaEdit onClick={() => startEdit(note)} />
                                        <FaTrashAlt onClick={() => deleteNote(note._id)} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="footer-bar">
                <p>&copy; {new Date().getFullYear()} Medhir Aryan</p>
            </div>
            <style jsx>{`
                body, html {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    background-color: #0d0d0d;
                }
                .outer-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    height: 100vh;
                }
                .main-navbar {
                    width: 100%;
                    background-color: #000;
                    color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px 0;
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 1000;
                    border-bottom: 5px solid grey; /* Thick grey border */
                }
                .container {
                    max-width: 800px;
                    margin: 70px auto 0 auto; /* Adjusted for fixed navbar */
                    padding: 20px;
                    background-color: #1a1a1a;
                    color: #f2f2f2;
                    border-radius: 10px;
                    min-height: 80vh;
                    display: flex;
                    flex-direction: column;
                }
                .navbar {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 10px 0;
                    background-color: #333;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }
                .navbar h1 {
                    color: #f2f2f2;
                    font-size: 24px;
                }
                .note-input {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 100px;
                }
                .note-input textarea {
                    padding: 10px;
                    font-size: 18px;
                    border-radius: 5px;
                    border: none;
                    height: 120px; /* Increased length */
                    margin-bottom: 10px;
                    background-color: #2a2a2a;
                    color: #f2f2f2;
                    resize: none;
                }
                .note-input button {
                    padding: 10px;
                    font-size: 18px;
                    background-color: #f39c12;
                    color: #fff;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                .notes-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    flex-grow: 1;
                    overflow-y: auto; /* Enable vertical scrolling */
                    max-height: calc(80vh - 40px); /* Adjust height to fit within container */
                }
                .note-item {
                    background-color: #2a2a2a;
                    padding: 15px;
                    border-radius: 10px;
                    position: relative;
                }
                .note-content p {
                    margin: 0;
                    font-size: 18px;
                    color: #f2f2f2;
                    cursor: pointer;
                }
                .note-actions {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    display: flex;
                    gap: 10px;
                }
                .note-actions svg {
                    color: #f39c12;
                    cursor: pointer;
                }
                .edit-note textarea {
                    width: 100%;
                    padding: 10px;
                    font-size: 18px;
                    border-radius: 5px;
                    background-color: #2a2a2a;
                    color: #f2f2f2;
                    resize: none;
                    border: none;
                    margin-bottom: 10px;
                }
                .edit-note button {
                    padding: 10px;
                    font-size: 18px;
                    background-color: #f39c12;
                    color: #fff;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-right: 10px;
                }
                .footer-bar {
                    width: 100%;
                    background-color: #000;
                    color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px 0;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    z-index: 1000;
                    border-top: 5px solid grey; /* Thick grey border for footer */
                }
            `}</style>
        </div>
    );
}
