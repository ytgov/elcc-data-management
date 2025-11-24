import { Model } from "@sequelize/core"

/**
 * Recursively saves a Sequelize model instance along with its associated models if they are new (unsaved).
 *
 * It handles `BelongsTo` associations and ensures associated model is saved _before_ the current model,
 * then propagates the foreign key relationship before saving the current model.
 *
 * It handles `HasMany` associations and ensures associated models are saved _after_ the current model,
 * propagating the foreign key relationship before saving.
 *
 * It handles `HasOne` associations and ensures the associated model is saved _after_ the current model,
 * propagating the foreign key relationship before saving.
 *
 * @template M - A Sequelize model type extending `Model`.
 * @param {M} modelInstance - The Sequelize model instance to be saved along with its associated models.
 * @returns {Promise<M>} - Returns the saved model instance.
 *
 * @example
 * // Given a non-persisted TravelSegment model instance, being passed via a HasMany association to a TravelAuthorization model.
 * // The TravelAuthorization is saved first, then the TravelSegment is updated with the travelAuthorizationId before it is saved.
 *
 * const travelSegment = travelSegmentFactory.build({
 *   departureOn: faker.date.past(),
 * })
 * const travelAuthorization = await travelAuthorizationFactory
 *   .associations({
 *     travelSegments: [travelSegment],
 *   })
 *   .transient({
 *     include: ["user", "travelSegments"],
 *   })
 *   .create({
 *     status: TravelAuthorization.Statuses.SUBMITTED,
 *   })
 *
 * @example
 * // Given a persisted TravelAuthorization passed to a TravelSegment model instance via a BelongsTo association.
 * // The TravelSegment is updated with the travelAuthorizationId before it is saved.
 *  const travelAuthorization = await travelAuthorizationFactory
 *    .transient({ roundTrip: true })
 *    .create()
 *  const whitehorse = await locationFactory.create({ city: "Whitehorse", province: "YT" })
 *  const vancouver = await locationFactory.create({ city: "Vancouver", province: "BC" })
 *  const travelSegment1 = await travelSegmentFactory
 *    .associations({
 *      travelAuthorization,
 *      departureLocation: whitehorse,
 *      arrivalLocation: vancouver,
 *    })
 *    .create({
 *      segmentNumber: 1,
 *      departureOn: new Date("2022-06-05"),
 *      departureTime: Stop.BEGINNING_OF_DAY,
 *      modeOfTransport: Stop.TravelMethods.AIRCRAFT,
 *      accommodationType: Stop.AccommodationTypes.HOTEL,
 *    })
 *
 * @example
 * // Given a generic TravelAuthorization creation.
 * // The factory will create the purpose and user associations if they are not provided.
 * // Then the onCreated hook will call nestedSaveAndAssociateIfNew to save
 * // the purpose and user associations as they are new.
 * // Then those associations will propagate their foreign keys to the travelAuthorization before it is saved.
 * const travelAuthorization = await travelAuthorizationFactory.create()
 */
export async function nestedSaveAndAssociateIfNew<M extends Model>(modelInstance: M): Promise<M> {
  const modelClass = modelInstance.constructor as typeof Model
  const associations = modelClass.associations

  const belongsToAssociationNames: string[] = []
  const hasManyAssociationNames: string[] = []
  const hasOneAssociationNames: string[] = []

  for (const [associationName, { associationType }] of Object.entries(associations)) {
    if (associationType === "BelongsTo") {
      belongsToAssociationNames.push(associationName)
    } else if (associationType === "HasMany") {
      hasManyAssociationNames.push(associationName)
    } else if (associationType === "HasOne") {
      hasOneAssociationNames.push(associationName)
    } else {
      // no-op - maybe I should warn?
    }
  }

  for (const associationName of belongsToAssociationNames) {
    const associationDefinition = associations[associationName]
    const foreignKeyName = associationDefinition.foreignKey
    let foreignKeyValue = modelInstance.get(foreignKeyName)
    if (foreignKeyValue !== undefined) continue

    // Maybe should be associationAccessor instead of as?
    const associationAlias = associationDefinition.as as keyof M
    const associatedInstance = modelInstance[associationAlias] as Model | undefined
    if (associatedInstance === undefined) continue

    // @ts-expect-error - TS doesn't know that targetKey is a property of associationDefinition
    const { targetKey }: { targetKey: keyof typeof associatedInstance } = associationDefinition
    if (associatedInstance.isNewRecord !== true) {
      foreignKeyValue = associatedInstance.get(targetKey)
      modelInstance.set(foreignKeyName, foreignKeyValue)
      continue
    }

    const updatedAssocationInstance = await nestedSaveAndAssociateIfNew(associatedInstance)
    foreignKeyValue = updatedAssocationInstance.get(targetKey)
    modelInstance.set(foreignKeyName, foreignKeyValue)
  }

  if (modelInstance.isNewRecord === true) {
    await modelInstance.save()
  }

  for (const associationName of hasManyAssociationNames) {
    const associationDefinition = associations[associationName]

    // Maybe should be associationAccessor instead of as?
    const associationAlias = associationDefinition.as as keyof M
    const associatedInstances = modelInstance[associationAlias] as Model[] | undefined
    if (associatedInstances === undefined) continue

    for (const associatedInstance of associatedInstances) {
      if (associatedInstance.isNewRecord !== true) continue

      // @ts-expect-error - TS doesn't know that sourceKey is a property of associationDefinition
      const {
        sourceKey,
        foreignKey,
      }: { sourceKey: keyof M; foreignKey: keyof typeof associatedInstance } = associationDefinition
      const sourceKeyValue = modelInstance.get(sourceKey)

      associatedInstance.set(foreignKey, sourceKeyValue)
      await nestedSaveAndAssociateIfNew(associatedInstance)
    }
  }

  for (const associationName of hasOneAssociationNames) {
    const associationDefinition = associations[associationName]

    // Maybe should be associationAccessor instead of as?
    const associationAlias = associationDefinition.as as keyof M
    const associatedInstance = modelInstance[associationAlias] as Model | undefined
    if (associatedInstance === undefined) continue

    if (associatedInstance.isNewRecord !== true) continue

    // @ts-expect-error - TS doesn't know that sourceKey is a property of associationDefinition
    const {
      sourceKey,
      foreignKey,
    }: { sourceKey: keyof M; foreignKey: keyof typeof associatedInstance } = associationDefinition
    const sourceKeyValue = modelInstance.get(sourceKey)

    associatedInstance.set(foreignKey, sourceKeyValue)
    await nestedSaveAndAssociateIfNew(associatedInstance)
  }

  return modelInstance
}

export default nestedSaveAndAssociateIfNew
