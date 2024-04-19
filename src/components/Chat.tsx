import React, { useState, useEffect, FormEvent, useRef } from "react";
import db from "./FirebaseConfig";
import firebase from "firebase/compat/app";
import "../styles/Chat.css";

interface Message {
  id: string;
  text: string;
  timestamp: firebase.firestore.Timestamp | null;
  sender: string;
}

interface TypingStatus {
  username: string;
  isTyping: boolean;
}

interface ChatProps {
  username: string;
}

const Chat: React.FC<ChatProps> = ({ username }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [otherUserTyping, setOtherUserTyping] = useState<boolean>(false);

  // Ref to track the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listener for loading messages
    const unsubscribeMessages = db
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot(
        (snapshot) => {
          const messagesList = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              text: data.text,
              timestamp: data.timestamp as firebase.firestore.Timestamp,
              sender: data.sender,
            };
          });
          setMessages(messagesList);
          setLoading(false);

          // Scroll to the bottom of the messages container
          scrollToBottom();
        },
        (error) => {
          console.error("Error loading messages: ", error);
          setLoading(false);
        }
      );

    // Listener for other user's typing status
    const otherUsername = username === "mai" ? "azaken" : "mai";
    const typingStatusDocRef = db.collection("status").doc(otherUsername);
    const unsubscribeTypingStatus = typingStatusDocRef.onSnapshot(
      (docSnapshot) => {
        const data = docSnapshot.data() as TypingStatus;
        setOtherUserTyping(data?.isTyping ?? false);
      },
      (error) => {
        console.error("Error loading typing status: ", error);
      }
    );

    // Clean up the listeners on component unmount
    return () => {
      unsubscribeMessages();
      unsubscribeTypingStatus();
    };
  }, [username]);

  // Function to handle input change and update typing status
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);

    // Update typing status
    db.collection("status")
      .doc(username)
      .set({
        username,
        isTyping: newMessage.trim().length > 0,
      });
  };

  // Function to send a new message and reset typing status
  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();

    if (message.trim()) {
      // Add the new message to Firestore
      await db.collection("messages").add({
        text: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        sender: username,
      });

      // Reset message input
      setMessage("");

      // Reset typing status
      db.collection("status").doc(username).set({
        username,
        isTyping: false,
      });

      // Scroll to the bottom of the messages container after sending a message
      scrollToBottom();
    }
  };

  // Function to scroll to the bottom of the messages container
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <h1>Welcome {username}</h1>
      <div className="chat-container">
        {/* Display loading message while messages are loading */}
        {loading && <p>Loading messages, please wait...</p>}

        {/* Chat messages container */}
        <div className="messages-container">
          {messages.map((msg) => (
            <div key={msg.id} className="message">
              <span className="sender">{msg.sender}:</span>
              <span className="message-text">{msg.text}</span>
              {/* Check if timestamp is valid before calling toDate() */}
              {msg.timestamp ? (
                <span className="timestamp">
                  {" "}
                  ({msg.timestamp.toDate().toLocaleString()})
                </span>
              ) : (
                <span className="timestamp"> (No timestamp available)</span>
              )}
            </div>
          ))}
          {/* Use the ref to track the end of the messages container */}
          <div ref={messagesEndRef} />
        </div>

        {/* Display typing status of the other user */}
        {otherUserTyping && (
          <p className="typing-status">
            {username === "mai" ? "azaken" : "mai"} is typing...
          </p>
        )}

        {/* Chat input form */}
        <form className="chat-input-form" onSubmit={sendMessage}>
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            className="chat-input"
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </form>
      </div>
    </>
  );
};

export default Chat;
