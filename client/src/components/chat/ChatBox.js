import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { IoSendOutline } from "react-icons/io5";
import { TiMessageTyping } from "react-icons/ti";
import {
  IoCheckmarkCircleOutline,
  IoCheckmarkDoneCircleOutline,
} from "react-icons/io5";
import { useParams } from "react-router-dom";

import classes from "./ChatBox.module.css";
import { getMessages } from "../../api/api";
import { chatActions } from "../../store/chatSlice";
import { useSocket } from "../../store/socketContext";

const ChatBox = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const { jwt } = useCookies(["jwt"])[0];
  const userId = useSelector((state) => state.auth.user?._id);
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();
  const socket = useSocket();
  const typingTimeout = useRef(null);
  const chatBoxRef = useRef(null);
  const { id: chatId } = useParams();
  const sortedMessages = messages.filter(
    (msg) => msg.receiver._id === chatId || msg.sender._id === chatId
  );

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  });

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await getMessages(chatId, jwt);
      if (res.status === "success") {
        dispatch(chatActions.setMessages(res.data.messages));
      } else {
        console.log("Error", res.message);
      }
    };
    fetchMessages();
  }, [chatId, dispatch, jwt]);

  // Handle typing events message read
  useEffect(() => {
    if (socket) {
      socket.on("typing", () => {
        setIsTyping(true);
      });

      socket.on("stopTyping", () => {
        setIsTyping(false);
      });

      socket.on("messagesRead", ({ messageIds }) => {
        dispatch(chatActions.markMessagesAsRead(messageIds));
      });

      return () => {
        socket.off("typing");
        socket.off("stopTyping");
        socket.off("messagesRead");
      };
    }
  }, [dispatch, socket]);

  // Mark messages as read when new messages are received
  useEffect(() => {
    const unreadMessageIds = messages
      .filter((msg) => !msg.read && msg.sender._id === chatId)
      .map((msg) => msg._id);

    if (unreadMessageIds.length > 0) {
      socket.emit("messagesRead", {
        messageIds: unreadMessageIds,
        chatId,
        userId,
      });
    }
  }, [messages, chatId, userId, socket]);

  const chatInputChangedHandler = (event) => {
    setChatInput(event.target.value);

    if (event.target.value.trim() !== "") {
      socket.emit("typing", { chatId, userId });
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socket.emit("stopTyping", { chatId, userId });
      }, 3000);
    } else {
      socket.emit("stopTyping", { chatId, userId });
    }
  };

  const sendMessageHandler = () => {
    if (chatInput.trim() === "") return;

    const message = {
      senderId: userId,
      receiverId: chatId,
      content: chatInput.trim(),
    };

    socket.emit("sendMessage", message);
    setChatInput("");
  };

  return (
    <div className={classes.chatBox}>
      <div ref={chatBoxRef} className={classes.chat}>
        {sortedMessages.map((chat) => (
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
            {!chat.read && chat.sender._id === userId && (
              <IoCheckmarkCircleOutline className={classes.sent} />
            )}
            {chat.read && chat.sender._id === userId && (
              <IoCheckmarkDoneCircleOutline className={classes.read} />
            )}
          </div>
        ))}
      </div>
      {isTyping && <TiMessageTyping className={classes.typing} />}
      <div className={classes.action}>
        <textarea value={chatInput} onChange={chatInputChangedHandler} />
        <IoSendOutline className={classes.icon} onClick={sendMessageHandler} />
      </div>
    </div>
  );
};

export default ChatBox;
