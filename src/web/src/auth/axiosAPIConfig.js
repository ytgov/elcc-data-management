// A small wrapper for axios to include a jwt with the api request
// this could be refactored into vuex to get around possible async issues

import axios from "axios";
import { getInstance } from "@/auth/auth0-plugin";

const auth = getInstance();

export const api = axios.create({
  headers: {
    Authorization: `Bearer ${auth.getTokenSilently()}`,
    "Content-Type": "application/json"
  }
});

export default api;
