import React, { useState } from "react";
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
  Spinner,
} from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/form-control";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import axios from "../../axios";
import UsersListItem from "../chats/UsersListItem";
import ChatLoading from "../chats/ChatLoading";
import UserBadgeItem from "../chats/UserBadgeItem";

const UpdateGroupChatModal = ({ reFetch, setReFetch }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();

  const { user, selectedChat, setSelectedChat } = ChatState();

  const handleDeleteUser = async (newUser) => {
    if (
      selectedChat.groupAdmin._id !== user.item._id &&
      newUser._id !== user.item._id
    ) {
      toast({
        title: "Only admin can remove member from the group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      };

      const updateData = {
        chatId: selectedChat._id,
        userId: newUser._id,
      };

      const { data } = await axios.put(
        `/chat/group/removeuser`,
        updateData,
        config
      );

      newUser._id === user.item._id ? setSelectedChat() : setSelectedChat(data.item);
      setReFetch(!reFetch);
      setLoading(false);
    } catch (error) {
        console.log("error", error);
      setLoading(false);
      toast({
        title: "Something went wrong, Please try again",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleAddUser = async (newUser) => {
    if (selectedChat.users.find((u) => u._id === newUser._id)) {
      toast({
        title: "User alredy in the group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    if (selectedChat.groupAdmin._id !== user.item._id) {
      toast({
        title: "Only admin can add new member in the group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      };

      const updateData = {
        chatId: selectedChat._id,
        userId: newUser._id,
      };

      const { data } = await axios.put(
        `/chat/group/adduser`,
        updateData,
        config
      );

      setSelectedChat(data.item);
      setReFetch(!reFetch);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: error.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      };

      const updateData = {
        chatId: selectedChat._id,
        chatName: groupChatName,
      };

      const { data } = await axios.put(
        `/chat/group/rename`,
        updateData,
        config
      );

      setSelectedChat(data.item);
      setReFetch(!reFetch);
      setRenameLoading(false);

      toast({
        title: "Group Name updated successfuly",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      setRenameLoading(false);
      toast({
        title: error.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }

    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data.items);
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

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box w="100%" display="flex" flexWrap="wrap" pb="3">
              {selectedChat.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDeleteUser(user)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Group Name"
                mb="3"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add Users"
                mb="1"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <div>
                <Spinner size="lg" mt={2} mb="2" />
              </div>
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
            <Button colorScheme="red" onClick={() => handleDeleteUser(user.item)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
