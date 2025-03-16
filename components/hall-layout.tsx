"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import type { Table } from "@/lib/types"
import { MapPin } from "lucide-react"

interface HallLayoutProps {
  layoutImage: string
  tables: Table[]
  highlightedTable?: Table | null
  selectableMode?: boolean
  onTableSelect?: (table: Table) => void
}

export default function HallLayout({
  layoutImage,
  tables,
  highlightedTable,
  selectableMode = false,
  onTableSelect,
}: HallLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [hoveredTable, setHoveredTable] = useState<Table | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        if (containerRef.current) {
          setContainerSize({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
          })
        }
      }

      updateSize()
      window.addEventListener("resize", updateSize)
      return () => window.removeEventListener("resize", updateSize)
    }
  }, [])

  const handleTableClick = (table: Table) => {
    if (selectableMode && onTableSelect && table.seat_availabe > 0) {
      onTableSelect(table)
    }
  }

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <Image
        src={layoutImage || "/placeholder.svg"}
        alt="Hall Layout"
        fill
        style={{ objectFit: "cover" }}
        className="rounded-lg"
      />

      {tables.map((table) => {
        const isHighlighted = highlightedTable?.table_no === table.table_no
        const isHovered = hoveredTable?.table_no === table.table_no
        const isSelectable = selectableMode && table.seat_availabe > 0

        // Calculate position based on container size
        const posX = table.position_x * containerSize.width
        const posY = table.position_y * containerSize.height

        return (
          <div
            key={table.table_no}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
              isHighlighted ? "z-20 scale-125" : "z-10"
            } ${isHovered ? "scale-110" : ""} ${
              isSelectable ? "cursor-pointer" : ""
            } ${!selectableMode || table.seat_availabe > 0 ? "" : "opacity-50"}`}
            style={{ left: `${posX}px`, top: `${posY}px` }}
            onClick={() => handleTableClick(table)}
            onMouseEnter={() => setHoveredTable(table)}
            onMouseLeave={() => setHoveredTable(null)}
          >
            <div className="flex flex-col items-center">
              <MapPin
                className={`h-8 w-8 drop-shadow-md ${
                  isHighlighted ? "text-rose-600 animate-bounce" : isSelectable ? "text-gold-500" : "text-gray-400"
                }`}
              />
              <div
                className={`-mt-1 rounded-full px-2 py-0.5 font-serif text-xs font-bold text-white shadow-md ${
                  isHighlighted ? "bg-rose-600" : isSelectable ? "bg-gold-500" : "bg-gray-500"
                }`}
              >
                {table.table_no}
              </div>

              {(isHovered || isHighlighted) && (
                <div className="absolute -bottom-12 left-1/2 w-24 -translate-x-1/2 rounded-md bg-white p-1 text-center text-xs shadow-lg">
                  <p className="font-serif font-semibold">Table {table.table_no}</p>
                  <p className="font-display text-gray-600">{table.seat_availabe} available</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

