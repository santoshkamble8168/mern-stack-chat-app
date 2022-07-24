import React, {useState, useEffect} from 'react'
import {
  Container,
  Box,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  Button,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from '../../context/ChatProvider';
import ProfileModal from '../modals/ProfileModal';
import {useNavigate} from "react-router-dom"
import { useDisclosure } from '@chakra-ui/react';
import axios from '../../axios';
import ChatLoading from './ChatLoading';
import UsersListItem from './UsersListItem';

const SideDrawer = () => {
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState()
  const {user, setSelectedChat, chats, setChats} = ChatState()
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose} = useDisclosure()
  const toast = useToast();

  const logout = () => {
    localStorage.removeItem("user")
    navigate("/")
  }

  const HandleSearch = async() => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return
    }

    try {
      setIsLoading(true)
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/user?search=${search}`, config)
      setIsLoading(false)
      setSearchResult(data.items)
    } catch (error) {
      setIsLoading(false);
      toast({
        title: error.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  }

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true)
      const config = {
        headers: {
          "Content-Type":"application/json",
          authorization: `Bearer ${user.token}`,
        }
      };

      const { data } = await axios.post("/chat", {userId}, config)
      if (!chats.find((chat) => chat._id === data.item._id))
        setChats([data.item, ...chats]);

      setLoadingChat(false)
      setSelectedChat(data.item)
      console.log("data.items", data.item);
      onClose()

    } catch (error) {
      setLoadingChat(false);
      toast({
        title: error.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  }

  return (
    <>
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button
            variant={"ghost"}
            onClick={() => {
              onOpen();
              setSearchResult([]);
              setSearch("");
            }}
          >
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"2xl"} fontFamily="Work sans">
          Chat App
        </Text>
        <div>
          <Menu>
            <MenuButton p="1">
              <BellIcon fontSize="2xl" m="1" />
            </MenuButton>
            {/* <MenuList /> */}
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor="pointer"
                name={user.item.name}
                src={user.item.avatar}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user.item}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb="2">
              <Input
                placeholder="Search by name or email"
                mr="2"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={HandleSearch}>Go</Button>
            </Box>
            {isLoading ? (
              <ChatLoading />
            ) : (
              searchResult.length > 0 &&
              searchResult?.map((userItem) => (
                <UsersListItem
                  user={userItem}
                  key={userItem._id}
                  handleFunction={() => accessChat(userItem._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer