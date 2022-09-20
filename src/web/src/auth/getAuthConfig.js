import axios from 'axios'
/* eslint-disable */
export async function getAuthConfig (url) {
  return await axios.post(url).then(response => {
    return response.data
  })
}