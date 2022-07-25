import React, {useState} from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  Image,
  Text,
  useToast,
  Input,
  Box,
} from "@chakra-ui/react";
import {FormControl} from "@chakra-ui/form-control"
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import axios from "../../axios";
import UsersListItem from "../chats/UsersListItem";
import ChatLoading from "../chats/ChatLoading";
import UserBadgeItem from "../chats/UserBadgeItem";

export const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const { user, chats, setChats} = ChatState()

  const handleSearch = async (query) => {
    setSearch(query)
    if (!query) {
        return
    }

    try {
        setLoading(true)
        const config = {
        headers: {
          "Content-Type":"application/json",
          authorization: `Bearer ${user.token}`,
        }
      };

      const { data } = await axios.get(`/user?search=${search}`, config)
      setLoading(false)
      setSearchResult(data.items)
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
  }

  const handleSubmit = async () => {
    if (!groupChatName || !users) {
        toast({
          title: "Please fill all the fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      };

      const groupData = {
        name: groupChatName,
        users: JSON.stringify(users.map(user => user._id))
      }

      const { data } = await axios.post(`/chat/group`, groupData, config);
      setChats([data.item, ...chats])
      onClose(false);
      toast({
        title: "New group chat created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }


  }

  const handleAddUser = (userToAdd) => {
    if (users.includes(userToAdd)) {
        toast({
          title: "User already added",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });

        return
    }

    setUsers([...users, userToAdd])
  }

  const handleDeleteUser = (delUser) => {
    setUsers(users.filter(selUser => selUser._id !== delUser._id))
  }


  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {"Create new Group"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <FormControl>
              <Input
                placeholder="Group Name"
                mb="3"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add Users"
                mb="1"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            
            <Box
                w={"100%"}
                display="flex"
                flexWrap="wrap"
            >
                {users.map(user => (
                    <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDeleteUser(user)}  />
                ))}
            </Box>
            {loading ? (
              <div><ChatLoading /></div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UsersListItem
                    key={user._id}
                     user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
