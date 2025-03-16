import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 })
  }

  try {
    // Find the event first to verify it exists
    const event = await prisma.event.findUnique({
      where: { id },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Get all tables for this event
    const tables = await prisma.table.findMany({
      where: { eventId: id },
      include: { families: true },
    })

    // Extract all families from all tables
    const allFamilies = tables.flatMap((table) =>
      table.families.map((family) => ({
        ...family,
        table_id: table.table_no,
      })),
    )

    // Filter families by name (exact word match as per requirements)
    const matchedFamilies = allFamilies.filter((family) => {
      const nameParts = family.name.toLowerCase().split(" ")
      return nameParts.some((part) => part === query.toLowerCase())
    })

    return NextResponse.json(matchedFamilies)
  } catch (error) {
    console.error("Error searching guests:", error)
    return NextResponse.json({ error: "Failed to search for guests" }, { status: 500 })
  }
}

