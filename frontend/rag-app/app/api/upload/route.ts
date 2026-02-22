import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const backendUrl = process.env.AI_SERVER_URL || "http://localhost:8888";

    try {
        // Forward the multipart form data as-is to the backend
        const formData = await req.formData();

        const res = await fetch(`${backendUrl}/upload`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            return NextResponse.json({ error: `Backend returned ${res.status}` }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
