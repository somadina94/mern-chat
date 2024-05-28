import { Fragment } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

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
  return (
    <Fragment>
      <RouterProvider router={router} />
    </Fragment>
  );
}

export default App;
