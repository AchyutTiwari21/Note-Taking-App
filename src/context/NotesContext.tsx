import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import noteService from '@/backend-api/note';

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

const mockNotes: Note[] = [
  {
    _id: '1',
    title: 'Project Planning',
    content: 'Need to finalize the project requirements and create a detailed timeline. Should include milestones for each phase of development.',
    preview: 'Need to finalize the project requirements and create a detailed timeline...',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    title: 'Meeting Notes',
    content: 'Team meeting discussed new features, budget allocation, and upcoming deadlines. Action items: Review design mockups, Set up development environment, Schedule client presentation.',
    preview: 'Team meeting discussed new features, budget allocation, and upcoming deadlines...',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    _id: '3',
    title: 'Reading List',
    content: 'Books to read: "The Design of Everyday Things" by Don Norman, "Atomic Habits" by James Clear, "Clean Code" by Robert Martin.',
    preview: 'Books to read: "The Design of Everyday Things" by Don Norman...',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  }
];

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(mockNotes);

  useEffect(() => {

    (async () => {
      try {
        const noteResponse: NoteRespone[] = await noteService.getNotes();

        if(noteResponse) {
          const noteData = noteResponse.map(note => {
            return {...note, preview: note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '')}
          })
          setNotes(noteData);
        }
      } catch (error: any) {
        console.log(error.message || "Error while fetching notes.");
        throw error;
      }
    })();
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

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
        throw new Error("Error while updating note.")
      }
    } catch (error: any) {
      console.log(error.message);
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