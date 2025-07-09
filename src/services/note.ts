import config from "@/config/config";

export class NoteService {

    async addNote({title, content}: {title: string, content: string}) {
        try {
            const response = await fetch(`${config.PRODUCTION_API_URL}/api/v1/note/add-note`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({title, content})
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || 'Error while creating note.');
            } else {
                return true;
            }   

        } catch (error: any) {
            console.log(error.message || 'Error while creating note.');
            throw error;
        }
    }
      
    async getNotes() {
        try {
            const response = await fetch(`${config.PRODUCTION_API_URL}/api/v1/note/get-notes`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || 'Error while fetching notes.');
            } else {
                return data.data;
            }   

        } catch(error: any) {
            console.log(error.message || 'Error while fetching notes.');
            throw error;  
        }
    }

    async deleteNote(id: string) {
        try {
            const response = await fetch(`${config.PRODUCTION_API_URL}/api/v1/note/delete-note/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || 'Error while deleting note.');
            } else {
                return true;
            }   

        } catch (error: any) {
            console.log(error.message || 'Error while deleting note.');
            throw error;
        }
    }

    async updateNote({id, title, content}: {id: string, title: string | undefined, content: string | undefined}) {
        try {
            const response = await fetch(`${config.PRODUCTION_API_URL}/api/v1/note/update-note/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({title, content})
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || 'Error while updating note.');
            } else {
                return true;
            }   

        } catch (error: any) {
            console.log(error.message || 'Error while updating note.');
            throw error;
        }
    }
}

const noteService = new NoteService();
export default noteService;