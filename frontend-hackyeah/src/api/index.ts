import axios from "axios";
const API_URL = "http://10.243.195.222:8000"
export const api = axios.create({
    baseURL: API_URL
})
