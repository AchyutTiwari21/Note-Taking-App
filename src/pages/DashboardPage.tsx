import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PenTool, Plus, Search, LogOut, Edit3, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotes, NoteRespone } from '@/context/NotesContext';
import { toast } from 'sonner';
import noteService from '@/backend-api/note';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const DashboardPage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { notes, setNotes, addNote } = useNotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    NProgress.configure({ showSpinner: false });
    (async () => {
      NProgress.start();
      try {
        const noteResponse: NoteRespone[] = await noteService.getNotes();

        if(noteResponse) {
          const noteData = noteResponse.map(note => {
            return {...note, preview: note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '')}
          })
          setNotes(noteData);
        }
      } 
      catch (error: any) {
        console.log(error.message || "Error while fetching notes.");
        throw error;
      }
      finally {
        setLoading(false);
        NProgress.done();
      }
    })();
  }, []);

  const handleLogout = async () => {
    NProgress.start();
    await logout();
    NProgress.done();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleCreateNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }
    
    try {
      NProgress.start();
      await addNote(newNote.title, newNote.content);
      toast.success('Note created successfully!');
    } 
    catch (error:any) {
      toast.error(error.message);
      return;
    } 
    finally {
      setNewNote({ title: '', content: '' });
      setIsCreateDialogOpen(false);
      NProgress.done()
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return null;
  }

  if(loading) {
    return <div className='w-full h-screen items-center justify-center'>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PenTool className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">NoteTaker</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.fullName}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Create Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search your notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Note</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter note title"
                    value={newNote.title}
                    onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your note here..."
                    value={newNote.content}
                    onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                  />
                </div>
                <Button
                  onClick={handleCreateNote}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Create Note
                </Button>
              </div>
              <style>{`
                :global([data-radix-dialog-content] button[aria-label="Close"]) {
                  color: #374151 !important;
                }
                :global([data-radix-dialog-content] button[aria-label="Close"]:hover) {
                  color: #111827 !important;
                }
              `}</style>
            </DialogContent>
          </Dialog>
        </div>

        {/* Notes Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No notes found' : 'No notes yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Create your first note to get started'
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Note
                </Button>
              )}
            </div>
          ) : (
            filteredNotes.map((note) => (
              <Card key={note._id} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <Link to={`/note/${note._id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {note.title}
                      </CardTitle>
                      <Edit3 className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {note.preview}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                      <Calendar className="w-3 h-3" />
                      <span>
                         {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;