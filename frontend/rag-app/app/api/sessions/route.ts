import { NextResponse } from "next/server";

export async function GET() {
    const backendUrl = process.env.AI_SERVER_URL || "http://localhost:8888";

    try {
        const res = await fetch(`${backendUrl}/sessions`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            return NextResponse.json({ error: `Backend returned ${res.status}` }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
