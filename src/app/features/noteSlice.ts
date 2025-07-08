import { createSlice } from "@reduxjs/toolkit";

export interface noteState {
    notes: Array<{
        _id: string;
        title: string;
        content: string;
        type?: 'text' | 'checklist';
        items?: { text: string; done: boolean }[];
        pinned?: boolean;
        archived?: boolean;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}

const initialState: noteState = {
    notes: []
}

const noteSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        initializeNotes: (state, action) => {
            state.notes = action.payload;
        },
        clearNotes: (state) => {
            state.notes = [];
        },
        // Actions to add, update, and delete notes
        addNote: (state, action) => {
            state.notes.push(action.payload);
        },
        updateNote: (state, action) => {
            const { id, updatedNote } = action.payload;

            const note = state.notes.find(note => note._id === id);
            if (note) {
                note.title = updatedNote?.title ?? note.title;
                note.content = updatedNote?.content ?? note.content;
            }
        },
        deleteNote: (state, action) => {
            const id = action.payload;
            state.notes = state.notes.filter(note => note._id !== id);
        }
    }
});

export const { initializeNotes, clearNotes, addNote, updateNote, deleteNote } = noteSlice.actions;

export default noteSlice.reducer;