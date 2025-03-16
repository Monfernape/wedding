import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const body = await request.json()
    const { table_no, name, phone_number, member_count } = body

    if (!table_no || !name || !phone_number || !member_count) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find the event first to verify it exists
    const event = await prisma.event.findUnique({
      where: { id },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Find the table
    const table = await prisma.table.findFirst({
      where: {
        eventId: id,
        table_no: table_no,
      },
    })

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 })
    }

    // Check if there are enough seats
    if (table.seat_availabe < member_count) {
      return NextResponse.json({ error: "Not enough seats available at this table" }, { status: 400 })
    }

    // Create new family and update table in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create new family
      const newFamily = await prisma.family.create({
        data: {
          name,
          phone_number,
          member_count,
          checked_at: new Date(),
          tableId: table.id,
        },
      })

      // Update table seats
      const updatedTable = await prisma.table.update({
        where: { id: table.id },
        data: {
          seat_availabe: table.seat_availabe - member_count,
          seat_assigned: table.seat_assigned + member_count,
        },
      })

      return { newFamily, updatedTable }
    })

    // Get all updated tables for the event
    const updatedTables = await prisma.table.findMany({
      where: { eventId: id },
    })

    return NextResponse.json(updatedTables)
  } catch (error) {
    console.error("Error registering guest:", error)
    return NextResponse.json({ error: "Failed to register guest" }, { status: 500 })
  }
}

