"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { Family } from "@/lib/types"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  member_count: z
    .number()
    .min(1, { message: "Must have at least 1 member" })
    .max(20, { message: "Maximum 20 family members allowed" }),
  phone_number: z.string().min(10, { message: "Please enter a valid phone number" }),
})

interface GuestRegistrationProps {
  onSubmit: (data: Partial<Family>) => void
  onCancel: () => void
}

export default function GuestRegistration({ onSubmit, onCancel }: GuestRegistrationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      member_count: 1,
      phone_number: "",
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      onSubmit(values)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-serif text-gray-700">Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your full name"
                  {...field}
                  className="elegant-input border-champagne-300 py-6 text-lg font-display"
                />
              </FormControl>
              <FormMessage className="font-sans text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="member_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-serif text-gray-700">Number of Family Members (including yourself)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  placeholder="Enter number of family members"
                  {...field}
                  onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                  className="elegant-input border-champagne-300 py-6 text-lg font-display"
                />
              </FormControl>
              <FormMessage className="font-sans text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-serif text-gray-700">Phone Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  {...field}
                  className="elegant-input border-champagne-300 py-6 text-lg font-display"
                />
              </FormControl>
              <FormMessage className="font-sans text-sm" />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1 bg-rose-700 py-6 font-sans text-lg tracking-wider hover:bg-rose-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Continue"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-champagne-300 py-6 font-sans text-lg"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

