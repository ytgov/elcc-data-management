// Runs after all tests in a file are done
import db from "@/models"

async function truncateAllTables() {
  const modelNames = Object.keys(db.models).filter(
    (modelName) => !["SequelizeMeta"].includes(modelName)
  )
  const models = modelNames.map((modelName) => db.models[modelName])

  try {
    await Promise.all(
      models.map((model) => model.destroy({ where: {}, force: true, logging: false }))
    )
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

afterAll(async () => {
  await truncateAllTables()
})
