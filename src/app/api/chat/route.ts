import {NextResponse} from "next/server";

export async function POST(request: Request) {
    
    const body = await request.json();
        console.log("Received message from client:", body); // Log the received message from the client (for debugging purposes)
    if (body.message.toLowerCase().includes("hello")) {
        return NextResponse.json({message: "Hello! How can I assist you today?"}); // If the message includes "hello", respond with a greeting message
    }
}
    