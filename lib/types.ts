export interface Event {
  id: string
  bride: string
  groom: string
  wedding_date: string | Date
  hall_layout_image: string
  tables: Table[]
}

export interface Table {
  id?: string
  table_no: string
  seat_availabe: number
  seat_assigned: number
  position_x: number
  position_y: number
  eventId?: string
  families?: Family[]
}

export interface Family {
  id?: string
  table_id: string
  name: string
  member_count: number
  phone_number: string
  checked_at?: string | Date
  tableId?: string
}

