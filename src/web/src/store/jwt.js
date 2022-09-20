import axios from "axios";
import { getInstance } from "@/auth/auth0-plugin"

export async function prepareAxios() {
  const auth = await getInstance();
  const token = await auth.getTokenSilently();

  return axios.create({
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": 'application/json'
    }
  });
}

export async function secureGet(url) {
  let api = await prepareAxios();
  return api.get(url);
}

export async function securePut(url, body) {
  let api = await prepareAxios();
  return api.put(url, body);
}

export async function securePost(url, body) {
  let api = await prepareAxios();
  return api.post(url, body);
}

export async function secureDelete(url) {
  let api = await prepareAxios();
  return api.delete(url);
}
