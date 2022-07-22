import axios from "axios";
const API_URL = "http://127.0.0.1:4000/api/v1"; //use .env fiel to store URLs

const instance = axios.create({
  baseURL: API_URL,
});

// Alter defaults after instance has been created
instance.defaults.headers.post["Content-Type'"] = "application/json";

export default instance;