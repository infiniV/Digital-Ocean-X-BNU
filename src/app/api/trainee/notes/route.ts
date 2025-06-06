import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { notes } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// Define request validation schemas
const createNoteSchema = z.object({
  content: z.string().min(1),
  slideId: z.string().uuid(),
});

const updateNoteSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1),
});

// POST endpoint to create a new note
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as z.infer<typeof createNoteSchema>;
    const result = createNoteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request format", details: result.error.format() },
        { status: 400 },
      );
    }

    const { content, slideId } = result.data;

    const newNote = await db
      .insert(notes)
      .values({
        content,
        slideId,
        traineeId: session.user.id,
      })
      .returning();

    return NextResponse.json({ note: newNote[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 },
    );
  }
}

// PATCH endpoint to update a note
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as z.infer<typeof updateNoteSchema>;
    const result = updateNoteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request format", details: result.error.format() },
        { status: 400 },
      );
    }

    const { id, content } = result.data;

    // Verify note ownership
    const note = await db.query.notes.findFirst({
      where: and(eq(notes.id, id), eq(notes.traineeId, session.user.id)),
    });

    if (!note) {
      return NextResponse.json(
        { error: "Note not found or unauthorized" },
        { status: 404 },
      );
    }

    const updatedNote = await db
      .update(notes)
      .set({
        content,
        updatedAt: new Date(),
      })
      .where(eq(notes.id, id))
      .returning();

    return NextResponse.json(updatedNote[0]);
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 },
    );
  }
}
