import { Sequelize } from "sequelize"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sequelizeVersion = (Sequelize as any).version
const major = sequelizeVersion.split(".").map(Number)[0]

if (major >= 7) {
  console.warn("This was shim was probably make redundant in Sequelize v7, you should check!")
}

const MssqlDataTypes = {
  NOW: Sequelize.literal("GETDATE()"),
}

export { MssqlDataTypes }
