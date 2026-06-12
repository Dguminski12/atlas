import {NextResponse} from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Initialize the OpenAI client with the API key from environment variables
});

export async function POST(request: Request) {
    try {
        const body = await request.json(); // Parse the incoming request body as JSON to extract the message sent by the user
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini", // Specify the model to use for generating chat completions
            messages: [
                {
                    role: "user",
                    content: body.message,
                },
            ],
        });
        const atlasResponse = 
            completion.choices[0].message.content ?? "Sorry, I couldn't generate a response."; // Extract the generated message content from the OpenAI response, providing a fallback message in case of an error

        return NextResponse.json({ message: atlasResponse }); // Return the generated message as a JSON response to the client
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Atlas encountered and error."
            },
            {
                status: 500
            }
        );
    }
}
    