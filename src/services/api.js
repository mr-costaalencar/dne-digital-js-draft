// services/api.js
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: API_URL,
});

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    await AsyncStorage.setItem("jwtToken", response.data.token);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};

export const registerUser = async (email, password) => {
  try {
    const response = await api.post("/api/auth/signup", { email, password });
    await AsyncStorage.setItem("jwtToken", response.data.token);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem("jwtToken");
    return { success: true, message: "Logout bem-sucedido" };
  } catch (error) {
    return { success: false, message: "Falha ao sair" };
  }
};

export const getDocumentData = async (qrCodeData) => {
  try {
    const token = await AsyncStorage.getItem("jwtToken");
    const response = await api.get(`/api/students/${qrCodeData}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
