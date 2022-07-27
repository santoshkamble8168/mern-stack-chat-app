import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import axios from "../../axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender, getSenderDetails } from "../../config/ChatConfig";
import { GroupChatModal } from "../modals/GroupChatModal";

const MyChatList = ({ reFetch }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchAllChats = async () => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/chat", config);
      setChats(data.item);
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setLoggedUser(userData?.item);
    fetchAllChats();
  }, [reFetch]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p="3"
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb="3"
        px="3"
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p="3"
        bg="#f8f8f8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38b2ac" : "#e8e8e8"}
                color={selectedChat === chat ? "white" : "black"}
                px="3"
                py="2"
                borderRadius="lg"
                key={chat._id}
                display="flex"
              >
                <Avatar
                  size={"sm"}
                  cursor="pointer"
                  name={chat.chatName}
                  src={
                    chat.isGroupChat
                      ? chat.chatName
                      : getSenderDetails(loggedUser, chat?.users).pic
                  }
                  style={{ marginRight: "10px" }}
                />
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChatList;
