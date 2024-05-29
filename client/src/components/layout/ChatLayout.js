// import { useState } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";

import classes from "./ChatLayout.module.css";
import Sidebar from "../chat/Sidebar";
import ChatBox from "../chat/ChatBox";
import NewChat from "../chat/NewChat";

const ChatLayout = () => {
  const [chatList, setChatList] = useState([]);
  const [isNewChat, setIsNewChat] = useState(false);
  const { id: chatId } = useParams();

  return (
    <div className={classes.layout}>
      {isNewChat && (
        <NewChat setChatList={setChatList} setIsNewChat={setIsNewChat} />
      )}
      <Sidebar
        chatList={chatList}
        setChatList={setChatList}
        setIsNewChat={setIsNewChat}
      />
      <div className={classes.content}>{chatId && <ChatBox />}</div>
    </div>
  );
};

export default ChatLayout;
