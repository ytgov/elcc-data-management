import { API_PORT, APPLICATION_NAME } from "@/config"
import app from "@/app"

app.listen(API_PORT, async () => {
  console.log(`${APPLICATION_NAME} API listenting on port ${API_PORT}`)
})
