import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { notes } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

interface RouteParams {
  params: Promise<{
    noteId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { noteId } = await params;

    // Get all notes for this slide from the current user
    const userNotes = await db.query.notes.findMany({
      where: and(
        eq(notes.slideId, noteId),
        eq(notes.traineeId, session.user.id),
      ),
      orderBy: (notes, { desc }) => [desc(notes.createdAt)],
    });

    return NextResponse.json({ notes: userNotes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { noteId } = await params;

    // Verify note ownership
    const note = await db.query.notes.findFirst({
      where: and(eq(notes.id, noteId), eq(notes.traineeId, session.user.id)),
    });

    if (!note) {
      return NextResponse.json(
        { error: "Note not found or unauthorized" },
        { status: 404 },
      );
    }

    await db.delete(notes).where(eq(notes.id, noteId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 },
    );
  }
}
