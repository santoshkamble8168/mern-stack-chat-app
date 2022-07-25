import React, {useEffect, useState} from 'react'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import { ChatState } from '../../context/ChatProvider'
import axios from '../../axios'
import {AddIcon} from "@chakra-ui/icons"
import ChatLoading from './ChatLoading'
import { getSender } from '../../config/ChatConfig'
import SingleChat from './SingleChat'


const MyChat = ({reFetch, setReFetch }) => {
  const [loggedUser, setLoggedUser] = useState()
  const {selectedChat} = ChatState()
  const toast = useToast()

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p="3"
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat reFetch={reFetch} setReFetch={setReFetch} />
    </Box>
  );
}

export default MyChat