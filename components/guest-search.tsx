"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Family } from "@/lib/types"

interface GuestSearchProps {
  eventId: string
  onGuestFound: (guest: Family) => void
  onGuestNotFound: () => void
}

export default function GuestSearch({ eventId, onGuestFound, onGuestNotFound }: GuestSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Family[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchTerm.trim()) {
      setError("Please enter a name to search")
      return
    }

    setSearching(true)
    setError(null)

    try {
      const response = await fetch(`/api/event/${eventId}/guests?q=${encodeURIComponent(searchTerm)}`)

      if (!response.ok) {
        throw new Error("Failed to search for guests")
      }

      const results = await response.json()
      setSearchResults(results)

      if (results.length === 0) {
        setError("No guests found with that name")
      }
    } catch (err) {
      setError("An error occurred while searching. Please try again.")
      console.error(err)
    } finally {
      setSearching(false)
    }
  }

  const handleGuestSelect = (guest: Family) => {
    onGuestFound(guest)
    setSearchResults([])
    setSearchTerm("")
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter your first or last name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="elegant-input border-champagne-300 pl-10 py-6 text-lg font-display"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-champagne-500" />
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            className="w-full bg-rose-700 py-6 font-sans text-lg tracking-wider hover:bg-rose-800"
            disabled={searching}
          >
            {searching ? "Searching..." : "Find My Table"}
          </Button>
        </div>
      </form>

      {error && (
        <div className="rounded-md bg-rose-50 p-4 font-display text-rose-800">
          <p>{error}</p>
          <Button
            onClick={onGuestNotFound}
            variant="link"
            className="mt-2 p-0 font-sans text-rose-700 hover:text-rose-900"
          >
            Not on the list? Register here
          </Button>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-serif font-medium text-gray-700">Select your name:</h3>
          <div className="max-h-60 overflow-y-auto rounded-md border border-champagne-200">
            {searchResults.map((guest, index) => (
              <button
                key={index}
                onClick={() => handleGuestSelect(guest)}
                className="w-full border-b border-champagne-100 p-3 text-left hover:bg-champagne-50 last:border-b-0"
              >
                <div className="font-serif font-medium">{guest.name}</div>
                <div className="font-display text-sm text-gray-500">Family of {guest.member_count}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-center">
        <Button onClick={onGuestNotFound} variant="link" className="font-sans text-rose-700 hover:text-rose-900">
          Not on the list? Register here
        </Button>
      </div>
    </div>
  )
}

