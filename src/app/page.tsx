"use client";
import {useState} from 'react';

  type Message = { // Define the structure and type of a chat message
    sender: string;
    message: string;
    timestamp: string;
  };

export default function Home() {


  const [currentInput, setCurrentInput] = useState(""); // State to hold the current input value from the chatbox
  const [chatHistory, setChatHistory] = useState<Message[]>([]); // State to hold the history of chat messages, initialized as an empty array of type 'message'

  const sendMessage = async () => { // Function to handle sending a message when the user clicks the send button or presses Enter
    if (currentInput.trim() === "") return; // Prevent sending empty messages
    
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: currentInput, 
       }),
    });
    const data = await response.json();


    const newMessage: Message = {  // Create a new message object with the sender as "user", the message content from currentInput, and a timestamp of the current time
      sender: "User",
      message: currentInput,
      timestamp: new Date().toLocaleTimeString()
    };
    const atlasMessage: Message = { 
      sender: "Atlas", 
      message: data.message, // Use the message from the server response as the content of the Atlas message
      timestamp: new Date().toLocaleTimeString()
    };

    setChatHistory(prev => [...prev, newMessage, atlasMessage]); // Update the chat history by adding both the user's message and the Atlas response to the existing array
    setCurrentInput(""); // Clear the input field after sending the message
  }

  return (
    <main className="home-hero">
      <h1 className="atlas-title">atlas</h1>
      <input 
        value={currentInput} // Set the value of the input field to the currentInput state, making it a controlled component
        onChange={(e) => setCurrentInput(e.target.value)} // Update the currentInput state as the user types in the input field
        onKeyDown={(e) => { // Add an event handler for the keydown event to allow sending the message when the user presses the Enter key
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        type="text"
        placeholder="Send a message..."
        className="atlas-chatbox" /> {/* Input field for the chatbox, with an onChange handler to update the currentInput state as the user types */}
      <div className="atlas-actions">
        <button className="atlas-button" onClick={sendMessage}>Send</button>
        <button className="atlas-button" onClick={() => setChatHistory([])}>Clear</button> {/* Button to clear the chat history by setting the chatHistory state back to an empty array */}
      </div>
      <div className="chat-history">
        {chatHistory.length === 0 && <div className="chat-message chat-message--empty">No messages yet. Start the conversation!</div>}
        {chatHistory.map((msg, index) => { // Map over the chatHistory array to render each message in the chat history
          const sender = msg.sender.toLowerCase();
          const senderClass = sender === "user" ? "chat-message--user" : "chat-message--atlas"; // Determine the CSS class for the message based on the sender, allowing for different styling for user and atlas messages

          return (
            <div key={index} className={`chat-message ${senderClass}`}> {/* Render each message in the chat history with sender-based styling */}
              <strong>{msg.sender}:</strong> {msg.message} <em className="chat-timestamp">{msg.timestamp}</em> 
            </div>
          );
        })} {/* Render the chat history by mapping over the chatHistory array and displaying each message with its sender and timestamp */}
      </div>
    </main>
  );
}
