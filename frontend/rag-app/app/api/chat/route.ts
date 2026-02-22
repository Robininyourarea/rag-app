import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const backendUrl = process.env.AI_SERVER_URL || "http://localhost:8888";
        const res = await fetch(`${backendUrl}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Backend error" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
