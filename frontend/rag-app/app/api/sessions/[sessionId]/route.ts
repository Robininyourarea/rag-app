import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = await params;
    const backendUrl = process.env.AI_SERVER_URL || "http://localhost:8888";
    const res = await fetch(`${backendUrl}/sessions/${sessionId}`);

    if (!res.ok) {
        return NextResponse.json({ error: "Backend error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
}
