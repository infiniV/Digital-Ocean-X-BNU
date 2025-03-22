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
      <div className="rounded-lg border border-dashed border-notion-disabled bg-notion-gray-light/5 p-notion-md text-center dark:border-notion-disabled-dark dark:bg-notion-gray-dark/5">
        <p className="font-geist text-base text-notion-text-light dark:text-notion-text-dark">
          Please sign in to view and manage your notes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-notion-xl">
      {/* Note input form with enhanced styling */}
      <div className="shadow-notion-xs space-y-notion-md rounded-lg bg-notion-background p-notion-md transition-all hover:shadow-notion dark:bg-notion-background-dark">
        <textarea
          className="text-notion-text w-full resize-none rounded-lg border border-notion-disabled bg-white p-notion-md font-geist text-base leading-relaxed transition-all placeholder:text-notion-disabled-text focus:border-notion-accent focus:ring-2 focus:ring-notion-accent/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-notion-disabled-dark dark:bg-notion-gray-dark dark:text-notion-text-dark dark:placeholder:text-notion-disabled-text-dark"
          rows={3}
          placeholder="Add a note about this slide..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          disabled={loading || !slideId}
        />
        <button
          onClick={handleCreateNote}
          disabled={loading || !newNote.trim() || !slideId}
          className="hover:bg-notion-accent-dark flex w-full items-center justify-center gap-notion-xs rounded-lg bg-notion-accent px-4 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-notion-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-notion-disabled disabled:hover:bg-notion-disabled-hover dark:focus:ring-offset-notion-background-dark dark:disabled:bg-notion-disabled-dark dark:disabled:hover:bg-notion-disabled-dark-hover"
        >
          <PlusCircle size={16} className="animate-pulse-slow" />
          <span className="ml-notion-xs">Add Note</span>
        </button>
      </div>

      {/* Notes list with improved layout and animations */}
      {loading && !notes.length ? (
        <div className="flex justify-center p-notion-lg">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-notion-accent/30 border-t-notion-accent"></div>
        </div>
      ) : notes.length > 0 ? (
        <div className="space-y-notion-md">
          {notes.map((note) => (
            <div
              key={note.id}
              className="shadow-notion-xs group animate-fade-in rounded-lg border border-notion-disabled bg-notion-background p-notion-lg transition-all duration-200 hover:shadow-notion dark:border-notion-disabled-dark dark:bg-notion-background-dark"
            >
              <div className="flex items-start justify-between gap-notion-md">
                <p className="text-notion-text flex-1 whitespace-pre-wrap font-geist text-sm leading-relaxed dark:text-notion-text-dark">
                  {note.content}
                </p>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="rounded-lg p-2 text-notion-disabled-text opacity-0 transition-all hover:bg-notion-pink/10 hover:text-notion-accent group-hover:opacity-100 dark:text-notion-disabled-text-dark dark:hover:bg-notion-pink-dark/20"
                  aria-label="Delete note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-notion-md border-t border-notion-disabled pt-notion-sm text-xs text-notion-disabled-text dark:border-notion-disabled-dark dark:text-notion-disabled-text-dark">
                {new Date(note.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="animate-fade-in rounded-lg border border-dashed border-notion-disabled bg-notion-gray-light/50 p-notion-xl text-center dark:border-notion-disabled-dark dark:bg-notion-gray-dark/50">
          <p className="font-geist text-sm text-notion-disabled-text dark:text-notion-disabled-text-dark">
            {slideId
              ? "No notes for this slide yet. Add your first note above!"
              : "Select a slide to view and add notes."}
          </p>
        </div>
      )}
    </div>
  );
}
