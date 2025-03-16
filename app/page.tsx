import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"

export default async function Home() {

  const firstEvent = await prisma.event.findFirst({
    orderBy: { createdAt: "desc" },
  })

  console.log('firstEvent', firstEvent)

  if (firstEvent) {
    return redirect(`/event/${firstEvent.id}`)
  } else {
    // If no events exist, show a message or redirect to a setup page
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-champagne-50 p-4">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-rose-800">No Events Found</h2>
          <p className="text-gray-700">Please seed the database first by making a POST request to /api/seed</p>
        </div>
      </div>
    )
  }
}

