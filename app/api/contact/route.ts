import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { portfolioOwnerId, formData } = body

    if (!portfolioOwnerId || !formData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Insert the contact submission
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert({
        portfolio_owner_id: portfolioOwnerId,
        form_data: formData,
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting contact submission:", error)
      return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
    }

    return NextResponse.json({ message: "Contact form submitted successfully", data }, { status: 200 })
  } catch (error) {
    console.error("Error in contact API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get contact submissions for the current user
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .eq("portfolio_owner_id", user.id)
      .order("submitted_at", { ascending: false })

    if (error) {
      console.error("Error fetching contact submissions:", error)
      return NextResponse.json({ error: "Failed to fetch contact submissions" }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error("Error in contact API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
