import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getSender, getSenderDetails } from "../../config/ChatConfig";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "../modals/ProfileModal";
import UpdateGroupChatModal from "../modals/UpdateGroupChatModal";
import axios from "../../axios";
import "./styles.css";
import ChatMessages from "./ChatMessages";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;

const SingleChat = ({ reFetch, setReFetch }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const toast = useToast();

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user.item);

    socket.on("connected", () => {
      setSocketConnected(true);
    });

    socket.on("typing", () => {
      setIsTyping(true)
    })

    socket.on("stopTyping", () => {
      setIsTyping(false);
    });
  }, []);

  useEffect(() => {
    getAllChats();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
     socket.on("messagereceived", (newMessageRecieved) => {
       if (
         !selectedChatCompare || // if chat is not selected or doesn't match current chat
         selectedChatCompare._id !== newMessageRecieved.chat._id
       ) {
         if (!notification.includes(newMessageRecieved)) {
           setNotification([newMessageRecieved, ...notification]);
           setReFetch(!reFetch);
         }
       } else {
         setMessages([...messages, newMessageRecieved]);
         setTimeout(() => {
           scrollToBottom();
         }, 100);
       }
     });
  });

  console.log(notification)

  const getAllChats = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/message/${selectedChat._id}`, config);
      setLoading(false);
      setMessages(data.item);
      setTimeout(() => {
        scrollToBottom();
      }, 100);

      socket.emit("joinchat", selectedChat._id);
    } catch (error) {
      setLoading(false);
      toast({
        title: error.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const scrollToBottom = () => {
    if (window.document.querySelector(".messages")) {
      var element = window.document.querySelector(".messages");
      element.scrollTo(0, element.scrollHeight + 50);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stopTyping", selectedChat._id)
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const sendNewMessage = {
          chatId: selectedChat._id,
          content: newMessage,
        };

        const { data } = await axios.post(`/message`, sendNewMessage, config);
        setMessages([...messages, data.item]);

        setTimeout(() => {
          scrollToBottom();
        }, 100);

        socket.emit("newmessage", data.item);
      } catch (error) {
        toast({
          title: error.response.data.message,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      }
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    //typing logic with socket
    if(!socketConnected) return

    if (!typing) {
      setTyping(true)
      socket.emit("typing", selectedChat._id)
    }

    //handle debouncing
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stopTyping", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);

  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            p="3"
            px="2"
            w="100%"
            fontFamily="Work Sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user.item, selectedChat.users)}
                <ProfileModal
                  user={getSenderDetails(user.item, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  reFetch={reFetch}
                  setReFetch={setReFetch}
                  getAllChats={getAllChats}
                />
              </>
            )}
          </Text>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p="3"
            bg="#e8e8e8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w="20"
                h="20"
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <>
                <div className="messages">
                  <ChatMessages messages={messages} />
                </div>
              </>
            )}

            <FormControl onKeyDown={sendMessage}>
              {isTyping ? (
                <>
                  <span className="typing">Typing...</span>
                </>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                placeholder="Message..."
                onChange={handleTyping}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="centrer"
          h="100%"
        >
          <Text fontSize="3xl" pb="3" fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
