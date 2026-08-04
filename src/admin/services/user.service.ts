import api from "../../services/api";

export const getUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

export const createUser = async (user: any) => {
  const { data } = await api.post("/users/create", user);
  return data;
};

export const updateUser = async (id: string, user: any) => {
  const { data } = await api.put("/users/update", {
    id,
    ...user,
  });
  return data;
};

export const deleteUser = async (id: string) => {
  const { data } = await api.delete("/users/delete", {
    data: { id },
  });
  return data;
};
