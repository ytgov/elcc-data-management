import db from "@/db/db-client"

export async function isValidConnection() {
  try {
    await db.authenticate()
    console.log("Connection has been established successfully.")
    return true
  } catch (error) {
    console.error("Unable to connect to the database:", error)
    return false
  }
}


if (require.main === module) {
  isValidConnection()
}
