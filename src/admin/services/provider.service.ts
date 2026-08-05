import api from "../../services/api";

export interface ProviderData {
  name: string;
  logo_url: string;
  tracking_base_url: string;
}

export async function createProvider(data: ProviderData) {
  const response = await api.post("/providers/create", data);

  console.log("Create Provider:", response.data);

  return response.data;
}

export async function getProviders() {
  const response = await api.get("/providers");

  console.log("Providers:", response.data);

  return response.data;
}

export async function updateProvider(id: string, data: ProviderData) {
  const response = await api.put("/providers/update", {
    id,
    ...data,
  });

  return response.data;
}

export async function deleteProvider(id: string) {
  const response = await api.delete("/providers/delete", {
    data: { id },
  });

  return response.data;
}
