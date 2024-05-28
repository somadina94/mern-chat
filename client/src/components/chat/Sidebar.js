import { useEffect } from "react";
import { MdOpenInNew } from "react-icons/md";
import { LuPanelLeftClose } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";

import classes from "./Sidebar.module.css";
import { getChatList } from "../../api/api";
import avatar from "../../images/chat-pic.webp";

const Sidebar = ({ setIsNewChat, chatList, setChatList }) => {
  const { jwt } = useCookies(["jwt"])[0];

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const response = await getChatList(jwt);
        setChatList(response.data.chatList);
      } catch (error) {
        console.error("Error fetching chat list", error);
      }
    };

    fetchChatList();
  }, [jwt, setChatList]);

  const sortedChatList = chatList.sort(
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
                <span className={classes.message}>
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
