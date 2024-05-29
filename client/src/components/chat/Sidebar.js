import { useEffect } from "react";
import { MdOpenInNew } from "react-icons/md";
import { LuPanelLeftClose } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";

import classes from "./Sidebar.module.css";
import { getChatList } from "../../api/api";
import avatar from "../../images/chat-pic.webp";
import { chatActions } from "../../store/chatSlice";
import { useSocket } from "../../store/socketContext";

const Sidebar = ({ setIsNewChat }) => {
  const { jwt } = useCookies(["jwt"])[0];
  const chatList = useSelector((state) => state.chat.chatList);
  const dispatch = useDispatch();
  const newChatList = Array.from(chatList);
  const userId = useSelector((state) => state.auth.user?._id);
  const messages = useSelector((state) => state.chat?.messages);
  const socket = useSocket();

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const response = await getChatList(jwt);

        dispatch(chatActions.setChatList(response.data.chatList));
      } catch (error) {
        console.error("Error fetching chat list", error);
      }
    };

    fetchChatList();
  }, [jwt, dispatch, messages]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (newMessage) => {
      dispatch(chatActions.addMessage(newMessage));
    };

    socket.on("messageReceived", handleMessageReceived);

    return () => {
      socket.off("messageReceived", handleMessageReceived);
    };
  }, [socket, dispatch]);

  const sortedChatList = newChatList.sort(
    (a, b) =>
      new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
  );
  return (
    <div className={classes.sidebar}>
      <div className={classes.menu}>
        <LuPanelLeftClose className={classes.icon} />
        <MdOpenInNew
          className={classes.icon}
          onClick={() => setIsNewChat(true)}
        />
      </div>
      <ul className={classes.chatList}>
        {sortedChatList.map((chat) => (
          <li key={chat.receiver.id} className={classes.chatItem}>
            <NavLink
              to={`/messages/${chat.receiver.id}`}
              className={(navData) =>
                navData.isActive
                  ? `${classes.chat} ${classes.active}`
                  : classes.chat
              }
            >
              <img src={avatar} alt="receiver" className={classes.photo} />
              <div className={classes.chatInfo}>
                <span className={classes["receiver-name"]}>
                  {chat.receiver.name}
                </span>
                <span
                  className={
                    !chat.lastMessage.read &&
                    chat.lastMessage.receiver === userId
                      ? `${classes.message} ${classes.unread}`
                      : `${classes.message} ${classes.read}`
                  }
                >
                  {chat.lastMessage.content}
                </span>
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
