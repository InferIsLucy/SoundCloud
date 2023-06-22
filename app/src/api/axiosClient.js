import axios from "axios";
import { urlApi } from "../constants";

const axiosClient = axios.create({
  // baseURL: "http://192.168.200.104:8088/api/v1",
  baseURL: `${urlApi}`,
  headers: {
    "Content-Type": "application/json",
  },
});
export default axiosClient;
