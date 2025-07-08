import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Note {
  id: string;
  title: string;
  content: string;
  preview: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesContextType {
  notes: Note[];
  addNote: (title: string, content: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
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
    id: '1',
    title: 'Project Planning',
    content: 'Need to finalize the project requirements and create a detailed timeline. Should include milestones for each phase of development.',
    preview: 'Need to finalize the project requirements and create a detailed timeline...',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Meeting Notes',
    content: 'Team meeting discussed new features, budget allocation, and upcoming deadlines. Action items: Review design mockups, Set up development environment, Schedule client presentation.',
    preview: 'Team meeting discussed new features, budget allocation, and upcoming deadlines...',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '3',
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
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      const parsedNotes = JSON.parse(storedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
      setNotes(parsedNotes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (title: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      preview: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, title: string, content: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { 
            ...note, 
            title, 
            content, 
            preview: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
            updatedAt: new Date() 
          }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const getNoteById = (id: string) => {
    return notes.find(note => note.id === id);
  };

  return (
    <NotesContext.Provider value={{
      notes,
      addNote,
      updateNote,
      deleteNote,
      getNoteById
    }}>
      {children}
    </NotesContext.Provider>
  );
};