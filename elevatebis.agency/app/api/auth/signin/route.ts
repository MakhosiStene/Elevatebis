// app/api/signin/route.ts
import { NextResponse } from "next/server";
import type { LoginCredentials } from "@/utilities/types/schemas";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/services/const/auth_const";

export async function POST(request: Request)
{
    const body: LoginCredentials = await request.json();
    const { email, password, rememberMe } = body;
    try
    {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/token/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        // Check if the response is ok
        if (!response.ok) throw new Error('Login failed');
        // Get the tokens from the response
        const data = await response.json();
        // Create response and set cookies
        const res = NextResponse.json(
            { success: true },
            { status: 200 }
        );
        // Set access token cookie (short-lived)
        res.cookies.set(ACCESS_TOKEN, data.access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 15, // 15 minutes
        });
        // Set refresh token cookie if rememberMe is true (longer-lived)
        if (rememberMe) {
            res.cookies.set(REFRESH_TOKEN, data.refresh, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });
        }
        return res;
    } catch (error: any)
    {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 401 }
        );
    }
}