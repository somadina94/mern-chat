import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { IoSendOutline } from "react-icons/io5";
import io from "socket.io-client";

import classes from "./ChatBox.module.css";
import { getMessages } from "../../api/api";

const ChatBox = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const { jwt } = useCookies(["jwt"])[0];
  const userId = useSelector((state) => state.auth.user._id);
  const socket = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socket.current = io("http://localhost:7000", {
      query: { token: jwt },
    });

    // Join the chat room
    socket.current.emit("joinRoom", chatId);

    // Fetch messages initially
    const fetchMessages = async () => {
      const res = await getMessages(chatId, jwt);
      if (res.status === "success") {
        setMessages(res.data.messages);
      } else {
        console.log("Error", res.message);
      }
    };
    fetchMessages();

    // Listen for new messages
    socket.current.on("messageReceived", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      // Leave the chat room and disconnect
      socket.current.emit("leaveRoom", chatId);
      socket.current.disconnect();
    };
  }, [jwt, chatId]);

  const chatInputChangedHandler = (event) => {
    setChatInput(event.target.value);
  };

  const sendMessageHandler = () => {
    if (chatInput.trim() === "") return;

    const message = {
      senderId: userId,
      receiverId: chatId,
      content: chatInput.trim(),
    };

    // Emit the message to the socket server
    socket.current.emit("sendMessage", message);

    // Clear the input field
    setChatInput("");
  };

  return (
    <div className={classes.chatBox}>
      <div className={classes.chat}>
        {messages.map((chat) => (
          <div
            className={
              userId === chat.sender._id
                ? `${classes.chatItem} ${classes.sender}`
                : `${classes.chatItem} ${classes.receiver}`
            }
            key={chat._id}
          >
            <span className={classes.time}>
              {new Date(chat.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
            <p className={classes["chat-message"]}>{chat.content}</p>
          </div>
        ))}
      </div>
      <div className={classes.action}>
        <textarea value={chatInput} onChange={chatInputChangedHandler} />
        <IoSendOutline className={classes.icon} onClick={sendMessageHandler} />
      </div>
    </div>
  );
};

export default ChatBox;
