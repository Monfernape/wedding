import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    // Clear existing data
    await prisma.family.deleteMany({})
    await prisma.table.deleteMany({})
    await prisma.event.deleteMany({})

    // Create a sample event
    const event = await prisma.event.create({
      data: {
        bride: "Emma",
        groom: "James",
        wedding_date: new Date("2025-06-15T18:00:00Z"),
        hall_layout_image: "/placeholder.svg?height=800&width=1200",
        tables: {
          create: [
            {
              table_no: "1",
              seat_availabe: 2,
              seat_assigned: 8,
              position_x: 0.2,
              position_y: 0.3,
              families: {
                create: [
                  {
                    name: "Mike Adams",
                    member_count: 4,
                    phone_number: "000-000-0000",
                    checked_at: new Date("2025-06-15T20:00:00Z"),
                  },
                  {
                    name: "Sarah Johnson",
                    member_count: 4,
                    phone_number: "111-111-1111",
                    checked_at: new Date("2025-06-15T20:15:00Z"),
                  },
                ],
              },
            },
            {
              table_no: "2",
              seat_availabe: 4,
              seat_assigned: 6,
              position_x: 0.5,
              position_y: 0.3,
              families: {
                create: [
                  {
                    name: "Fatima Abdul",
                    member_count: 6,
                    phone_number: "112-555-5555",
                    checked_at: new Date("2025-06-15T21:00:00Z"),
                  },
                ],
              },
            },
            {
              table_no: "3",
              seat_availabe: 10,
              seat_assigned: 0,
              position_x: 0.8,
              position_y: 0.3,
            },
            {
              table_no: "4",
              seat_availabe: 5,
              seat_assigned: 5,
              position_x: 0.2,
              position_y: 0.7,
              families: {
                create: [
                  {
                    name: "John Smith",
                    member_count: 5,
                    phone_number: "222-222-2222",
                    checked_at: new Date("2025-06-15T19:30:00Z"),
                  },
                ],
              },
            },
            {
              table_no: "5",
              seat_availabe: 8,
              seat_assigned: 2,
              position_x: 0.5,
              position_y: 0.7,
              families: {
                create: [
                  {
                    name: "David Lee",
                    member_count: 2,
                    phone_number: "333-333-3333",
                  },
                ],
              },
            },
            {
              table_no: "6",
              seat_availabe: 3,
              seat_assigned: 7,
              position_x: 0.8,
              position_y: 0.7,
              families: {
                create: [
                  {
                    name: "Maria Garcia",
                    member_count: 7,
                    phone_number: "444-444-4444",
                    checked_at: new Date("2025-06-15T20:45:00Z"),
                  },
                ],
              },
            },
          ],
        },
      },
    })

    // Create another sample event
    const secondEvent = await prisma.event.create({
      data: {
        bride: "Sophia",
        groom: "Michael",
        wedding_date: new Date("2025-07-22T17:00:00Z"),
        hall_layout_image: "/placeholder.svg?height=800&width=1200",
        tables: {
          create: [
            {
              table_no: "1",
              seat_availabe: 5,
              seat_assigned: 5,
              position_x: 0.3,
              position_y: 0.2,
              families: {
                create: [
                  {
                    name: "Robert Brown",
                    member_count: 3,
                    phone_number: "555-123-4567",
                  },
                  {
                    name: "Jennifer White",
                    member_count: 2,
                    phone_number: "555-987-6543",
                  },
                ],
              },
            },
            {
              table_no: "2",
              seat_availabe: 6,
              seat_assigned: 4,
              position_x: 0.6,
              position_y: 0.2,
              families: {
                create: [
                  {
                    name: "Thomas Wilson",
                    member_count: 4,
                    phone_number: "555-456-7890",
                  },
                ],
              },
            },
            {
              table_no: "3",
              seat_availabe: 10,
              seat_assigned: 0,
              position_x: 0.3,
              position_y: 0.5,
            },
            {
              table_no: "4",
              seat_availabe: 8,
              seat_assigned: 2,
              position_x: 0.6,
              position_y: 0.5,
              families: {
                create: [
                  {
                    name: "Elizabeth Taylor",
                    member_count: 2,
                    phone_number: "555-789-0123",
                  },
                ],
              },
            },
            {
              table_no: "5",
              seat_availabe: 10,
              seat_assigned: 0,
              position_x: 0.3,
              position_y: 0.8,
            },
            {
              table_no: "6",
              seat_availabe: 6,
              seat_assigned: 4,
              position_x: 0.6,
              position_y: 0.8,
              families: {
                create: [
                  {
                    name: "William Davis",
                    member_count: 4,
                    phone_number: "555-234-5678",
                  },
                ],
              },
            },
          ],
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      events: [event.id, secondEvent.id],
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}

