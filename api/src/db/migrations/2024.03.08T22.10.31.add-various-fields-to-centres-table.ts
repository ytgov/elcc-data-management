import { DataTypes } from "@sequelize/core"

import type { Migration } from "@/db/umzug"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn("centres", "license_holder_name", {
    type: DataTypes.STRING(100),
    allowNull: true,
  })
  await queryInterface.addColumn("centres", "contact_name", {
    type: DataTypes.STRING(100),
    allowNull: true,
  })
  await queryInterface.addColumn("centres", "physical_address", {
    type: DataTypes.STRING(250),
    allowNull: true,
  })
  await queryInterface.addColumn("centres", "mailing_address", {
    type: DataTypes.STRING(250),
    allowNull: true,
  })
  await queryInterface.addColumn("centres", "email", {
    type: DataTypes.STRING(100),
    allowNull: true,
  })
  await queryInterface.addColumn("centres", "alt_email", {
    type: DataTypes.STRING(100),
    allowNull: true,
  })
  await queryInterface.addColumn("centres", "phone_number", {
    type: DataTypes.STRING(20),
    allowNull: true,
  })
  await queryInterface.addColumn("centres", "alt_phone_number", {
    type: DataTypes.STRING(20),
    allowNull: true,
  })
  await queryInterface.addColumn("centres", "fax_number", {
    type: DataTypes.STRING(20),
    allowNull: true,
  })
  await queryInterface.addColumn("centres", "vendor_identifier", {
    type: DataTypes.STRING(20),
    allowNull: true,
  })
  await queryInterface.addColumn("centres", "is_first_nation_program", {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  await queryInterface.addColumn("centres", "inspector_name", {
    type: DataTypes.STRING(100),
    allowNull: true,
  })
  await queryInterface.addColumn("centres", "neighborhood", {
    type: DataTypes.STRING(100),
    allowNull: true,
  })

  await queryInterface.addColumn("centres", "region", {
    type: DataTypes.STRING(100),
    allowNull: true,
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn("centres", "licenseHolderName")
  await queryInterface.removeColumn("centres", "contactName")
  await queryInterface.removeColumn("centres", "physicalAddress")
  await queryInterface.removeColumn("centres", "mailingAddress")
  await queryInterface.removeColumn("centres", "email")
  await queryInterface.removeColumn("centres", "altEmail")
  await queryInterface.removeColumn("centres", "phoneNumber")
  await queryInterface.removeColumn("centres", "altPhoneNumber")
  await queryInterface.removeColumn("centres", "faxNumber")
  await queryInterface.removeColumn("centres", "vendorId")
  await queryInterface.removeColumn("centres", "isFirstNationProgram")
  await queryInterface.removeColumn("centres", "inspectorName")
  await queryInterface.removeColumn("centres", "neighborhood")
  await queryInterface.removeColumn("centres", "region")
}
