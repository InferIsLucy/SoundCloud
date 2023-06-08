import axios from "axios";

const axiosClient = axios.create({
  // baseURL: "http://192.168.200.104:8088/api/v1",
  baseURL: "http://192.168.31.104:3000",
  headers: {
    "Content-Type": "application/json",
  },
});
export default axiosClient;
