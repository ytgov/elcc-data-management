import type { SeedMigration } from "@/db/umzug"

export const up: SeedMigration = async ({ context: { Centre } }) => {
  await Centre.findOrCreate({
    where: {
      name: "Grow with Joy 2nd",
    },
    defaults: {
      name: "Grow with Joy 2nd",
      license: "123",
      community: "Whitehorse",
      region: Centre.Regions.WHITEHORSE,
      isFirstNationProgram: false,
      status: "Up to date",
      hotMeal: true,
      licensedFor: 19,
      lastSubmission: new Date("2019-01-01"),
    },
  })
  await Centre.findOrCreate({
    where: {
      name: "Happy Hearts Preschool",
    },
    defaults: {
      name: "Happy Hearts Preschool",
      license: "456",
      community: "Whitehorse",
      region: Centre.Regions.WHITEHORSE,
      isFirstNationProgram: false,
      status: "Up to date",
      hotMeal: true,
      licensedFor: 25,
      lastSubmission: new Date("2019-01-01"),
    },
  })
}

export const down: SeedMigration = async () => {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
