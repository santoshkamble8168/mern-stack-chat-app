import { Container, Box, Text, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React from 'react'
import Login from '../components/Auth/Login'
import Register from '../components/Auth/Register'

const Home = () => {
  return (
    <Container maxW='xl' centerContent>

      <Box
        display="flex"
        justifyContent="center"
        p="3"
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize={"4xl"} fontFamily="Work sans" color={"black"}>
          Chat App
        </Text>
      </Box>

      <Box
        bg={"white"}
        w="100%"
        borderRadius={"lg"}
        borderWidth="1px"
        p={"4"}
      >
        <Tabs variant='soft-rounded'>
          <TabList mb={"1em"}>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home