import { Fragment, useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { useCookies } from "react-cookie";
import { SocketProvider } from "./store/socketContext";
import { useSocket } from "./store/socketContext";
import { useSelector } from "react-redux";

import Layout from "./components/layout/Layout";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import ChatLayout from "./components/layout/ChatLayout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="signup" element={<SignUp />} />
      <Route path="login" element={<Login />} />
      <Route path="messages" element={<ChatLayout />} />
      <Route path="messages/:id" element={<ChatLayout />} />
    </Route>
  )
);

function App() {
  const { jwt } = useCookies(["jwt"])[0];
  const socket = useSocket();
  const userId = useSelector((state) => state.auth.user?._id);

  useEffect(() => {
    if (!socket || !userId) return;
    socket.emit("joinRoom", userId);
    console.log("joined", userId);

    return () => socket.emit("leaveRoom", userId);
  }, [socket, userId]);
  return (
    <Fragment>
      <SocketProvider token={jwt}>
        <RouterProvider router={router} />
      </SocketProvider>
    </Fragment>
  );
}

export default App;
