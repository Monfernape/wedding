"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import GuestSearch from "@/components/guest-search"
import HallLayout from "@/components/hall-layout"
import GuestRegistration from "@/components/guest-registration"
import type { Event, Family, Table } from "@/lib/types"
import { Sparkles } from "lucide-react"

enum Step {
  SEARCH = 0,
  SHOW_TABLE = 1,
  REGISTER = 2,
  SELECT_TABLE = 3,
  CONFIRMATION = 4,
}

export default function EventPage({ event }: { event: Event }) {
  const [step, setStep] = useState<Step>(Step.SEARCH)
  const [selectedGuest, setSelectedGuest] = useState<Family | null>(null)
  const [tables, setTables] = useState<Table[]>(event.tables)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [newGuest, setNewGuest] = useState<Partial<Family> | null>(null)

  const handleGuestFound = (guest: Family) => {
    setSelectedGuest(guest)
    setStep(Step.SHOW_TABLE)
  }

  const handleGuestNotFound = () => {
    setStep(Step.REGISTER)
  }

  const handleRegisterGuest = async (guest: Partial<Family>) => {
    setNewGuest(guest)
    setStep(Step.SELECT_TABLE)
  }

  const handleTableSelect = async (table: Table) => {
    if (!newGuest) return

    setSelectedTable(table)

    // Optimistic update
    const updatedTables = tables.map((t) => {
      if (t.table_no === table.table_no) {
        return {
          ...t,
          seat_availabe: t.seat_availabe - (newGuest.member_count || 0),
          seat_assigned: t.seat_assigned + (newGuest.member_count || 0),
        }
      }
      return t
    })

    setTables(updatedTables)

    try {
      const response = await fetch(`/api/event/${event.id}/guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table_no: table.table_no,
          name: newGuest.name,
          phone_number: newGuest.phone_number,
          member_count: newGuest.member_count,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to register guest")
      }

      const updatedTablesFromServer = await response.json()
      setTables(updatedTablesFromServer)
      setStep(Step.CONFIRMATION)
    } catch (error) {
      console.error("Error registering guest:", error)
      // Revert optimistic update on error
      setTables(event.tables)
      // Show error message
    }
  }

  const resetToSearch = () => {
    setStep(Step.SEARCH)
    setSelectedGuest(null)
    setSelectedTable(null)
    setNewGuest(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-champagne-50 pb-12">
      <header className="bg-gradient-to-r from-rose-800 to-rose-600 p-6 text-center text-white shadow-lg">
        <div className="relative mx-auto max-w-4xl">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 transform">
            <Sparkles className="h-6 w-6 text-gold-300 opacity-70" />
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-elegant text-shadow-sm md:text-5xl lg:text-6xl">
            {event.bride} <span className="font-italic">&</span> {event.groom}
          </h1>
          <div className="fancy-divider mt-2">
            <span className="relative z-10 bg-gradient-to-r from-rose-800 to-rose-600 px-4 font-display text-sm tracking-luxury text-champagne-100">
              CELEBRATE WITH US
            </span>
          </div>
          <p className="mt-2 font-display text-lg font-light tracking-wider text-champagne-100 md:text-xl">
            {new Date(event.wedding_date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <AnimatePresence mode="wait">
          {step === Step.SEARCH && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="elegant-card border-champagne-200 bg-white/95 shadow-xl">
                <CardContent className="p-6 md:p-8">
                  <h2 className="mb-6 text-center font-serif text-2xl font-semibold tracking-wide text-rose-800 md:text-3xl">
                    Find Your Table
                  </h2>
                  <GuestSearch
                    eventId={event.id}
                    onGuestFound={handleGuestFound}
                    onGuestNotFound={handleGuestNotFound}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === Step.SHOW_TABLE && selectedGuest && (
            <motion.div
              key="showTable"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="elegant-card border-champagne-200 bg-white/95 shadow-xl">
                <CardContent className="p-6 md:p-8">
                  <h2 className="mb-4 text-center font-serif text-2xl font-semibold tracking-wide text-rose-800 md:text-3xl">
                    Welcome, {selectedGuest.name}!
                  </h2>
                  <p className="mb-6 text-center font-display text-xl text-gray-600">
                    Your table is <span className="gold-text font-serif font-bold">Table {selectedGuest.table_id}</span>
                  </p>
                  <div className="relative mx-auto mb-6 h-[400px] w-full max-w-2xl overflow-hidden rounded-lg border border-champagne-200">
                    <HallLayout
                      layoutImage={event.hall_layout_image}
                      tables={tables}
                      highlightedTable={tables.find((t) => t.table_no === selectedGuest.table_id) || null}
                    />
                  </div>
                  <div className="text-center">
                    <button
                      onClick={resetToSearch}
                      className="rounded-md bg-rose-700 px-6 py-2 font-sans text-white transition-colors hover:bg-rose-800"
                    >
                      Back to Search
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === Step.REGISTER && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="elegant-card border-champagne-200 bg-white/95 shadow-xl">
                <CardContent className="p-6 md:p-8">
                  <h2 className="mb-6 text-center font-serif text-2xl font-semibold tracking-wide text-rose-800 md:text-3xl">
                    Register Your Family
                  </h2>
                  <GuestRegistration onSubmit={handleRegisterGuest} onCancel={resetToSearch} />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === Step.SELECT_TABLE && newGuest && (
            <motion.div
              key="selectTable"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="elegant-card border-champagne-200 bg-white/95 shadow-xl">
                <CardContent className="p-6 md:p-8">
                  <h2 className="mb-2 text-center font-serif text-2xl font-semibold tracking-wide text-rose-800 md:text-3xl">
                    Select Your Table
                  </h2>
                  <p className="mb-6 text-center font-display text-xl text-gray-600">
                    Please select a table for your family of {newGuest.member_count}
                  </p>
                  <div className="relative mx-auto mb-6 h-[400px] w-full max-w-2xl overflow-hidden rounded-lg border border-champagne-200">
                    <HallLayout
                      layoutImage={event.hall_layout_image}
                      tables={tables}
                      selectableMode={true}
                      onTableSelect={handleTableSelect}
                    />
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {tables
                      .filter((table) => table.seat_availabe > 0)
                      .map((table) => (
                        <button
                          key={table.table_no}
                          onClick={() => handleTableSelect(table)}
                          className="flex flex-col items-center rounded-lg border border-champagne-200 bg-white p-4 shadow-sm transition-colors hover:bg-champagne-50"
                        >
                          <span className="gold-text font-serif text-lg font-semibold">Table {table.table_no}</span>
                          <span className="font-display text-sm text-gray-500">
                            {table.seat_availabe} seats available
                          </span>
                        </button>
                      ))}
                  </div>
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setStep(Step.REGISTER)}
                      className="rounded-md bg-gray-200 px-6 py-2 font-sans text-gray-700 transition-colors hover:bg-gray-300"
                    >
                      Back
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === Step.CONFIRMATION && selectedTable && newGuest && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="elegant-card border-champagne-200 bg-white/95 shadow-xl">
                <CardContent className="p-6 md:p-8">
                  <div className="mb-6 text-center">
                    <h2 className="font-serif text-2xl font-semibold tracking-wide text-rose-800 md:text-3xl">
                      Welcome, {newGuest.name}!
                    </h2>
                    <p className="mt-2 font-display text-xl text-gray-600">
                      Your family has been assigned to{" "}
                      <span className="gold-text font-serif font-bold">Table {selectedTable.table_no}</span>
                    </p>
                  </div>
                  <div className="relative mx-auto mb-6 h-[400px] w-full max-w-2xl overflow-hidden rounded-lg border border-champagne-200">
                    <HallLayout
                      layoutImage={event.hall_layout_image}
                      tables={tables}
                      highlightedTable={selectedTable}
                    />
                  </div>
                  <div className="text-center">
                    <button
                      onClick={resetToSearch}
                      className="rounded-md bg-rose-700 px-6 py-2 font-sans text-white transition-colors hover:bg-rose-800"
                    >
                      Back to Search
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

