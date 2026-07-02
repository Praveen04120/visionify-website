import { NextResponse } from "next/server";
import { createSession } from "@/lib/session";

// Minimal rate limiting state for failed attempts in memory
const failedAttempts = new Map<string, { count: number; timestamp: number }>();

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    
    // Check rate limit
    const attempt = failedAttempts.get(ip);
    if (attempt) {
      if (attempt.count >= 5 && Date.now() - attempt.timestamp < 15 * 60 * 1000) {
        return NextResponse.json({ error: "Too many failed attempts. Try again in 15 minutes." }, { status: 429 });
      }
      // Reset if 15 mins passed
      if (Date.now() - attempt.timestamp >= 15 * 60 * 1000) {
        failedAttempts.delete(ip);
      }
    }

    const { password } = await request.json();
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctPassword) {
      return NextResponse.json({ error: "Server misconfiguration. Admin password not set." }, { status: 500 });
    }

    if (password === correctPassword) {
      // Clear failed attempts on success
      failedAttempts.delete(ip);
      
      // Create session cookie
      await createSession();
      
      return NextResponse.json({ success: true });
    } else {
      // Increment failed attempts
      const current = failedAttempts.get(ip) || { count: 0, timestamp: Date.now() };
      failedAttempts.set(ip, { count: current.count + 1, timestamp: Date.now() });
      
      // Delay response slightly to deter brute force
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
