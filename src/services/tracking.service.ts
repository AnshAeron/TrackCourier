import axios from "axios";

const API = "/api/track";

export const getShipment = async (trackingId: string) => {
  const response = await axios.get(`${API}/${trackingId}`);
  return response.data;
  
};

