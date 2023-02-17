// A small wrapper for axios to include a jwt with the api request

import axios from "axios";

export function SecureAPICall(method: string, token: string) {
  let headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    Object.assign(headers, { Authorization: `Bearer ${token}` });
  }
  return axios.create({
    method: method,
    headers: headers,
  });
}
