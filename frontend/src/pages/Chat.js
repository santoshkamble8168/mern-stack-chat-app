import React from 'react'
import {
  Container,
  Box,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import MyChat from '../components/chats/MyChat';
import MyChatList from '../components/chats/MyChatList';
import SideDrawer from '../components/chats/SideDrawer';
import { ChatState } from "../context/ChatProvider"

const Chat = () => {
  const { user } = ChatState()
  console.log("user", user);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer/>}
      <Box display={"flex"} justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChatList />}
        {user && <MyChat />}
      </Box>
    </div>
  );
}

export default Chat