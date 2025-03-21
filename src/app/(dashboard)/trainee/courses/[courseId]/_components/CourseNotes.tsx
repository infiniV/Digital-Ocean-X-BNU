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
      <div className="border-notion-disabled p-notion-md dark:border-notion-disabled-dark rounded-lg border border-dashed bg-notion-gray-light/5 text-center dark:bg-notion-gray-dark/5">
        <p className="font-serif text-base text-notion-text-light dark:text-notion-text-dark">
          Please sign in to view and manage your notes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-notion-lg">
      {/* Note input form */}
      <div className="space-y-notion-sm">
        <textarea
          className="border-notion-disabled p-notion-md dark:border-notion-disabled-dark w-full resize-none rounded-lg border bg-white font-serif text-base shadow-notion transition-all hover:shadow-notion-hover focus:border-notion-accent focus:ring-1 focus:ring-notion-accent/30 dark:bg-notion-gray-dark"
          rows={3}
          placeholder="Add a note about this slide..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          disabled={loading || !slideId}
        />
        <button
          onClick={handleCreateNote}
          disabled={loading || !newNote.trim() || !slideId}
          className="disabled:bg-notion-disabled disabled:hover:bg-notion-disabled-hover dark:disabled:bg-notion-disabled-dark dark:focus:ring-offset-dark/10 flex w-full items-center justify-center gap-2 rounded-lg bg-notion-accent px-4 py-2.5 text-sm font-medium text-notion-text-dark shadow-sm transition-all duration-200 hover:bg-opacity-90 hover:shadow-notion focus:outline-none focus:ring-2 focus:ring-notion-accent focus:ring-offset-2 disabled:cursor-not-allowed dark:hover:bg-opacity-80"
        >
          <PlusCircle size={16} className="opacity-90" />
          <span>Add Note</span>
        </button>
      </div>

      {/* Notes list with updated typography and spacing */}
      {loading && !notes.length ? (
        <div className="flex justify-center p-4">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-notion-accent"></div>
        </div>
      ) : notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="border-notion-disabled dark:border-notion-disabled-dark rounded-lg border bg-notion-background p-4 shadow-notion transition-shadow duration-200 hover:shadow-notion-hover dark:bg-notion-background-dark"
            >
              <div className="flex items-start justify-between">
                <p className="whitespace-pre-wrap font-geist text-sm leading-relaxed text-notion-text-light dark:text-notion-text-dark">
                  {note.content}
                </p>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-notion-disabled-text ml-2 rounded p-1.5 transition-colors hover:bg-notion-pink hover:text-notion-accent dark:hover:bg-notion-pink-dark/20"
                  aria-label="Delete note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="text-notion-disabled-text dark:text-notion-disabled-text-dark mt-3 font-geist text-xs">
                {new Date(note.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      ) : slideId ? (
        <div className="border-notion-disabled dark:border-notion-disabled-dark rounded-lg border border-dashed bg-notion-gray-light p-6 text-center dark:bg-notion-gray-dark">
          <p className="font-geist text-notion-text-light dark:text-notion-text-dark">
            No notes for this slide yet. Add your first note above!
          </p>
        </div>
      ) : (
        <div className="border-notion-disabled dark:border-notion-disabled-dark rounded-lg border border-dashed bg-notion-gray-light p-6 text-center dark:bg-notion-gray-dark">
          <p className="font-geist text-notion-text-light dark:text-notion-text-dark">
            Select a slide to view and add notes.
          </p>
        </div>
      )}
    </div>
  );
}
