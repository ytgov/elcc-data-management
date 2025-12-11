import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.sequelize.query(/* sql */ `
    UPDATE funding_regions
    SET
      region = CASE
        WHEN region = 'whitehorse' THEN 'Whitehorse'
        WHEN region = 'communities' THEN 'Communities'
        ELSE region
      END
  `)
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.sequelize.query(/* sql */ `
    UPDATE funding_regions
    SET
      region = CASE
        WHEN region = 'Whitehorse' THEN 'whitehorse'
        WHEN region = 'Communities' THEN 'communities'
        ELSE region
      END
  `)
}
