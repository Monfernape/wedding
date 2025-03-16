import { notFound } from "next/navigation"
import EventPage from "@/components/event-page"
import prisma from "@/lib/prisma"

export default async function EventDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const eventId = params.id

  try {
    // Find the event with its tables
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        tables: true,
      },
    })

    if (!event) {
      notFound()
    }

    return <EventPage event={event} />
  } catch (error) {
    console.error("Error fetching event:", error)
    throw new Error("Failed to load event")
  }
}

