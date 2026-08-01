import axios from "axios";

const API = "https://trackcourier-jut7.onrender.com/api/track";

export const getShipment = async (trackingId: string) => {
  const response = await axios.get(`${API}/${trackingId}`);
  return response.data;
  
};

