import { execSync } from "child_process"

export default async function globalSetup() {
  try {
    // Keep in sync with api/bin/boot-app.sh
    execSync(`npm run initializers`, { stdio: "inherit" })
  } catch (error) {
    console.error("Failed to run initializers:", error)
    process.exit(1)
  }
}
