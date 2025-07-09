import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Edit3, Trash2, Calendar, PenTool } from 'lucide-react';
import { useNotes } from '@/context/NotesContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const NoteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getNoteById, updateNote, deleteNote } = useNotes();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [note, setNote] = useState(getNoteById(id!));
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: note?.title || '',
    content: note?.content || ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    if (!note) {
      toast.error('Note not found');
      navigate('/dashboard');
      return;
    }

    setEditForm({
      title: note.title,
      content: note.content
    });
  }, [note, isAuthenticated, navigate]);

  const handleEdit = async () => {
    if (!editForm.title.trim() || !editForm.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    NProgress.start();
    try {
      await updateNote(id!, editForm.title, editForm.content);
      setNote((prev) => { 
        if(prev === undefined)
          return undefined;
        return {...prev, title: editForm.title, content: editForm.content}
      });
      
      toast.success('Note updated successfully!');
    } 
    catch (error: any) {
      toast.error(error.message || "Error while updating note.");
    }
    finally {
      setIsEditDialogOpen(false);
      NProgress.done();
    }
  };

  const handleDelete = async () => {
    NProgress.start();
    try {
      await deleteNote(id!);
      toast.success('Note deleted successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || "Error while deleting notes.")
    } finally {
      NProgress.done();
    }
  };

  if (!isAuthenticated || !note) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <PenTool className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">NoteTaker</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Note</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Title</Label>
                      <Input
                        id="edit-title"
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-content">Content</Label>
                      <Textarea
                        id="edit-content"
                        value={editForm.content}
                        onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                        rows={6}
                      />
                    </div>
                    <Button
                      onClick={handleEdit}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Save Changes
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

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2 text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your note.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              {note.title}
            </CardTitle>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Created: {new Date(note.updatedAt).toLocaleDateString()}</span>
              </div>
              {new Date(note.updatedAt).getTime() !== new Date(note.createdAt).getTime() && (
                <div className="flex items-center space-x-2">
                  <Edit3 className="w-4 h-4" />
                  <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {note.content}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NoteDetailPage;