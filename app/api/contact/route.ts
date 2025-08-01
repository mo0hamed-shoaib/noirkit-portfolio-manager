import { type NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false
  }
  
  record.count++
  return true
}

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const ip = forwarded?.split(",")[0] || realIp || "unknown"
  return ip
}

function validateCSRFToken(request: NextRequest): boolean {
  const origin = request.headers.get("origin")
  const referer = request.headers.get("referer")
  
  // Basic CSRF protection - check origin/referer
  if (origin && !origin.includes("localhost") && !origin.includes("your-domain.com")) {
    return false
  }
  
  if (referer && !referer.includes("localhost") && !referer.includes("your-domain.com")) {
    return false
  }
  
  return true
}

function sanitizeInput(data: any): any {
  if (typeof data === "string") {
    // Remove potentially dangerous characters
    return data.replace(/[<>]/g, "").trim()
  }
  
  if (typeof data === "object" && data !== null) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value)
    }
    return sanitized
  }
  
  return data
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    if (!checkRateLimit(clientId)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    // CSRF protection
    if (!validateCSRFToken(request)) {
      return NextResponse.json(
        { error: "Invalid request origin" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { portfolioOwnerId, formData, timestamp, userAgent } = body

    if (!portfolioOwnerId || !formData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate timestamp (prevent replay attacks)
    const requestTime = new Date(timestamp).getTime()
    const currentTime = Date.now()
    const timeDiff = Math.abs(currentTime - requestTime)
    
    if (timeDiff > 5 * 60 * 1000) { // 5 minutes
      return NextResponse.json(
        { error: "Request timestamp is too old" },
        { status: 400 }
      )
    }

    // Sanitize input
    const sanitizedFormData = sanitizeInput(formData)

    // Validate form data structure
    if (typeof sanitizedFormData !== "object" || sanitizedFormData === null) {
      return NextResponse.json(
        { error: "Invalid form data format" },
        { status: 400 }
      )
    }

    // Additional validation for required fields
    const requiredFields = ["name", "email", "message"]
    for (const field of requiredFields) {
      if (!sanitizedFormData[field] || typeof sanitizedFormData[field] !== "string") {
        return NextResponse.json(
          { error: `Missing or invalid ${field}` },
          { status: 400 }
        )
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedFormData.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Message length validation
    if (sanitizedFormData.message.length < 10 || sanitizedFormData.message.length > 1000) {
      return NextResponse.json(
        { error: "Message must be between 10 and 1000 characters" },
        { status: 400 }
      )
    }

    const supabase = supabaseServer

    // Insert the contact submission with additional security data
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert({
        portfolio_owner_id: portfolioOwnerId,
        form_data: sanitizedFormData,
        client_ip: clientId,
        user_agent: userAgent || "unknown",
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting contact submission:", error)
      return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
    }

    return NextResponse.json({ 
      message: "Contact form submitted successfully", 
      data,
      rateLimitRemaining: MAX_REQUESTS_PER_WINDOW - (rateLimitMap.get(clientId)?.count || 0)
    }, { status: 200 })
  } catch (error) {
    console.error("Error in contact API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = supabaseServer

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
