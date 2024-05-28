import { useState } from "react";
import { FaCheckDouble } from "react-icons/fa";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import classes from "./NewChat.module.css";
import { getUser } from "../../api/api";
import AuthAlert from "../UI/AuthAlert";
import Spinner from "../UI/Spinner";

const NewChat = ({ setChatList, setIsNewChat }) => {
  const [showIcon, setShowIcon] = useState(false);
  const [idInput, setIdInput] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertStatus, setAlertStatus] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { jwt } = useCookies(["jwt"])[0];
  const navigate = useNavigate();

  const searchHandler = async () => {
    if (idInput.trim() === "") return;
    setShowSpinner(true);
    const res = await getUser(idInput.trim(), jwt);
    if (res.status === "success") {
      const chatListItem = {
        receiver: {
          name: res.data.user.name,
          id: res.data.user._id,
          photo: res.data.user.photo,
        },
        lastMessage: { _id: Math.random.toString(), content: "" },
      };
      setChatList((prevstate) => [chatListItem, ...prevstate]);
      setShowIcon(true);
      navigate(`/messages/${res.data.user._id}`);
      setIsNewChat(false);
    } else {
      setAlertMsg(res.message);
      setAlertStatus(false);
      setShowAlert(true);
    }

    setTimeout(() => {
      setShowSpinner(false);
      setIdInput("");
    }, 3000);
  };
  return (
    <div className={classes.newChat}>
      {showSpinner && <Spinner />}
      {showAlert && <AuthAlert message={alertMsg} status={alertStatus} />}
      <button className={classes.close} onClick={() => setIsNewChat(false)}>
        X
      </button>
      <input
        type="text"
        value={idInput}
        onChange={(e) => setIdInput(e.target.value)}
      />
      <div className={classes.action}>
        <button onClick={searchHandler}>find</button>
        {showIcon && <FaCheckDouble className={classes.icon} />}
      </div>
    </div>
  );
};

export default NewChat;
