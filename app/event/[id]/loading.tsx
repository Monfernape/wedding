import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-rose-100">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-rose-700" />
        <p className="text-lg font-medium text-rose-800">Loading wedding details...</p>
      </div>
    </div>
  )
}

