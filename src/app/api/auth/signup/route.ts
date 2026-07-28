import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/lib/user-db";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 400 }
      );
    }

    const newUser = await createUser(email, password, name);
    if (!newUser) {
      return NextResponse.json(
        { error: "Failed to create user." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "User registered successfully.", 
        user: { email: newUser.email, name: newUser.name } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
