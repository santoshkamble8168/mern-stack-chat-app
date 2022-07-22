import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "../../axios";
import {useNavigate} from "react-router-dom"

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [togglePasword, setTogglePasword] = useState(false);
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast();
  const navigate = useNavigate()

  const uploadImage = async (pic) => {
    try {
      setImageUploading(true);
      if (pic === undefined) {
        toast({
          title: "Please select an image",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
        }

        if (pic.type === "image/jpeg" || pic.type === "image/png") {
          const data = new FormData();
          data.append("file", pic);
          data.append("upload_preset", "chatappmern");
          data.append("cloud_name", "dy1dl6rb9");

          let result = await fetch(
            "https://api.cloudinary.com/v1_1/dy1dl6rb9/image/upload",
            {
              method: "post",
              body: data,
            }
          );
          const urlData = await result.json();
          setPic(urlData.url);
          setImageUploading(false);
          toast({
            title: "Image uploaded successfuly",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }else{
            setImageUploading(false);
            toast({
              title: "Please select an image",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
        }
    } catch (error) {
      setImageUploading(false);
      toast({
        title: "Image upload failed",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleSubmit =  async(e) => {
    try {
        e.preventDefault()
        setIsSubmitting(true)
        const {data} = await axios.post("/register",{
            name, email, password, pic
        })

        setIsSubmitting(false);
        toast({
            title: "Registration successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/chat")
    } catch (error) {
        setIsSubmitting(false);
        toast({
          title: error.response.data.message,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter your password"
            type={togglePasword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setTogglePasword(!togglePasword)}
            >
              {togglePasword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter your password"
            type={toggleConfirmPassword ? "text" : "password"}
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setToggleConfirmPassword(!toggleConfirmPassword)}
            >
              {toggleConfirmPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic" isRequired>
        <FormLabel>Upload profile picture</FormLabel>
        <InputGroup>
          <Input
            type={"file"}
            p="1.5"
            accept="image/*"
            onChange={(e) => uploadImage(e.target.files[0])}
          />
          {pic && <InputRightElement width="4.5rem" style={{
            width: "30px",
            height: "30px",
            top: "4px",
            right: "6px"
          }}>
            <img src={pic} alt="profilepic" />
          </InputRightElement>}

          {imageUploading && (
            <InputRightElement width="4.5rem">
                <Button
                isLoading
                colorScheme="teal"
                variant="outline"
                spinnerPlacement="start"
                border={0}
                ></Button>
            </InputRightElement>
          )}
        </InputGroup>
      </FormControl>

      <Button
        colorScheme={"blue"}
        width="100%"
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
        isLoading={isSubmitting}
      >
        Register
      </Button>
    </VStack>
  );
};

export default Register;
