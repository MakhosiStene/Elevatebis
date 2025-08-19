// app/api/signup/route.ts
import { NextResponse } from "next/server";
import type { RegisterData } from "@/utilities/types/schemas";

export async function POST(request: Request) {
    const body: RegisterData = await request.json();
    const { email, password } = body;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create-account/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || "Signup failed");
        }

        const data = await response.json();

        return NextResponse.json(
            { success: true, user: data },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || "Something went wrong" },
            { status: 400 }
        );
    }
}
