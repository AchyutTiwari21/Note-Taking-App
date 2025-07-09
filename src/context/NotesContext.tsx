import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import noteService from '@/services/note';

export interface Note {
  _id: string;
  title: string;
  content: string;
  preview: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteRespone {
  _id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesContextType {
  notes: Note[];
  addNote: (title: string, content: string) => Promise<void>;
  setNotes: Dispatch<SetStateAction<Note[]>>;
  updateNote: (id: string, title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  getNoteById: (id: string) => Note | undefined;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = async (title: string, content: string) => {
    const newNote: Note = {
      _id: Date.now().toString(),
      title,
      content,
      preview: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      const isNoteAdded = await noteService.addNote({title, content});
      if(isNoteAdded)
        setNotes(prev => [newNote, ...prev]);
      else 
        throw new Error("Error while adding note!");
    } catch (error: any) {
      console.log(error.message);
      throw new Error(error.message || "Error while adding note.");
    }
  };

  const updateNote = async (id: string, title: string, content: string) => {
    try {
      const isNoteUpdated = await noteService.updateNote({id, title, content});
  
      if(isNoteUpdated){
        setNotes(prev => prev.map(note => 
        note._id === id 
          ? { 
              ...note, 
              title, 
              content, 
              preview: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
              updatedAt: new Date() 
            }
          : note
        ));
      } else {
        throw new Error("Error while updating note.");
      }
    } catch (error: any) {
      console.log(error.message);
      throw new Error(error.message || "Error while updating note.");
    }

  };

  const deleteNote = async (id: string) => {
    try {
      const isNoteDeleted = await noteService.deleteNote(id);
  
      if(isNoteDeleted) {
        setNotes(prev => prev.filter(note => note._id !== id));
      } else {
        throw new Error("Error while deleting note");
      }
    } catch (error: any) {
      console.log(error.message);
      throw new Error(error.message || "Error while deleting note.");
    }
  };

  const getNoteById = (id: string) => {
    return notes.find(note => note._id === id);
  };

  return (
    <NotesContext.Provider value={{
      notes,
      setNotes,
      addNote,
      updateNote,
      deleteNote,
      getNoteById,
    }}>
      {children}
    </NotesContext.Provider>
  );
};