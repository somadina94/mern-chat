import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatList: [],
  messages: [],
  typingStatus: {},
  socket: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatList(state, action) {
      state.chatList = action.payload;
    },
    addToChatList(state, action) {
      state.chatList.unshift(action.payload);
    },
    setMessages(state, action) {
      state.messages = action.payload;
    },

    addMessage(state, action) {
      const newMessage = action.payload;
      state.messages.push(newMessage);
      // Move the chat with the new message to the top of the chatList
      const chat = state.chatList.find(
        (chat) => chat.receiver.id === newMessage.receiver._id
      );
      if (chat) {
        chat.lastMessage = newMessage;
        // Move the chat to the top
        state.chatList = [
          chat,
          ...state.chatList.filter(
            (c) => c.receiver.id !== newMessage.receiver._id
          ),
        ];
      } else {
        state.chatList.unshift({
          receiver: { id: newMessage.receiverId, name: "New User" },
          lastMessage: newMessage,
        });
      }
    },
    updateChatList(state, action) {
      const newMessage = action.payload;
      const chatIndex = state.chatList.findIndex(
        (chat) => chat.receiver.id === newMessage.receiver._id
      );
      if (chatIndex !== -1) {
        state.chatList[chatIndex].lastMessage = newMessage;
        const updatedChat = state.chatList[chatIndex];
        state.chatList.splice(chatIndex, 1);
        state.chatList.unshift(updatedChat);
      } else {
        state.chatList.unshift({
          receiver: { id: newMessage.receiver._id, name: "New User" },
          lastMessage: newMessage,
        });
      }
    },

    markMessagesAsRead(state, action) {
      const messageIds = action.payload;
      if (messageIds.length > 0)
        state.messages = state.messages.map((message) =>
          messageIds.includes(message._id)
            ? { ...message, read: true }
            : message
        );
    },
  },
});

export const chatActions = chatSlice.actions;

export default chatSlice;
