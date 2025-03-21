"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Trash2, PlusCircle } from "lucide-react";
// import { toast } from "sonner";

// Define proper types for our notes
interface Note {
  id: string;
  content: string;
  slideId: string;
  traineeId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface CourseNotesProps {
  slideId: string;
}

export function CourseNotes({ slideId }: CourseNotesProps) {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch notes when the slideId changes
  useEffect(() => {
    if (!slideId || !session?.user.id) return;

    const fetchNotes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/trainee/notes/${slideId}`);
        if (!response.ok) throw new Error("Failed to fetch notes");

        const data = (await response.json()) as { notes: Note[] };
        setNotes(data.notes);
      } catch (error) {
        console.error("Error fetching notes:", error);
        // toast.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    void fetchNotes();
  }, [slideId, session?.user.id]);

  // Create a new note
  const handleCreateNote = async () => {
    if (!newNote.trim() || !slideId || !session?.user.id) return;

    setLoading(true);
    try {
      const response = await fetch("/api/trainee/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote, slideId }),
      });

      if (!response.ok) throw new Error("Failed to create note");

      const data = (await response.json()) as { note: Note };

      setNotes((prev) => [...prev, data.note]);
      setNewNote("");
      // toast.success("Note added successfully");
    } catch (error) {
      console.error("Error creating note:", error);
      // toast.error("Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  // Delete a note
  const handleDeleteNote = async (noteId: string) => {
    if (!noteId || !session?.user.id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/trainee/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete note");

      setNotes((prev) => prev.filter((note) => note.id !== noteId));
      // toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      // toast.error("Failed to delete note");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please sign in to view and manage your notes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Note input form */}
      <div className="flex flex-col space-y-2">
        <textarea
          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
          rows={3}
          placeholder="Add a note about this slide..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          disabled={loading || !slideId}
        ></textarea>
        <button
          onClick={handleCreateNote}
          disabled={loading || !newNote.trim() || !slideId}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300 dark:disabled:bg-gray-700"
        >
          <PlusCircle size={16} />
          <span>Add Note</span>
        </button>
      </div>

      {/* Notes list */}
      {loading && !notes.length ? (
        <div className="flex justify-center p-4">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      ) : notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="dark:bg-gray-850 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800"
            >
              <div className="flex items-start justify-between">
                <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                  {note.content}
                </p>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="ml-2 rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30"
                  aria-label="Delete note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {new Date(note.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      ) : slideId ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No notes for this slide yet. Add your first note above!
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a slide to view and add notes.
          </p>
        </div>
      )}
    </div>
  );
}
