import { BaseConstraintQueryOptions, RemoveConstraintQueryOptions } from "@sequelize/core"
import { MsSqlQueryInterface } from "@sequelize/mssql"

// TODO: investigate if we even still need this with Sequelize 7.

// TODO: implement a parallel interface to addConstraint
// UNIQUE
// queryInterface.addConstraint('Users', {
//   fields: ['email'],
//   type: 'unique',
//   name: 'custom_unique_constraint_name'
// });

// CHECK
// queryInterface.addConstraint('Users', {
//   fields: ['roles'],
//   type: 'check',
//   where: {
//      roles: ['user', 'admin', 'moderator', 'guest']
//   }
// });

// Default
// queryInterface.addConstraint('Users', {
//    fields: ['roles'],
//    type: 'default',
//    defaultValue: 'guest'
// });

// Primary Key
// queryInterface.addConstraint('Users', {
//    fields: ['username'],
//    type: 'primary key',
//    name: 'custom_primary_constraint_name'
// });

// Foreign Key
// queryInterface.addConstraint('Posts', {
//   fields: ['username'],
//   type: 'foreign key',
//   name: 'custom_fkey_constraint_name',
//   references: { // Required field
//     table: 'target_table_name',
//     field: 'target_column_name'
//   },
//   onDelete: 'cascade',
//   onUpdate: 'cascade'
// });

// Composite Foreign Key
// queryInterface.addConstraint('TableName', {
//   fields: ['source_column_name', 'other_source_column_name'],
//   type: 'foreign key',
//   name: 'custom_fkey_constraint_name',
//   references: { //Required field
//     table: 'target_table_name',
//     fields: ['target_column_name', 'other_target_column_name']
//   },
//   onDelete: 'cascade',
//   onUpdate: 'cascade'
// });

export enum MSSQL_CONSTRAINT_TYPES {
  PRIMARY_KEY = "PK",
  UNIQUE = "UQ",
  FOREIGN_KEY = "F",
  CHECK = "C",
  DEFAULT = "NOT IMPLEMENTED",
}

function findForeignKeyConstraintQuery(tableName: string, columnName: string) {
  return `
    SELECT
      foreign_keys.name AS constraintName
    FROM
      sys.foreign_keys
      INNER JOIN sys.foreign_key_columns ON foreign_keys.object_id = foreign_key_columns.constraint_object_id
      INNER JOIN sys.columns ON foreign_key_columns.parent_column_id = columns.column_id
        AND foreign_key_columns.parent_object_id = columns.object_id
    WHERE
      foreign_keys.parent_object_id = OBJECT_ID('${tableName}')
      AND columns.name = '${columnName}';
  `
}

function findNonForeignKeyConstraintQuery(
  tableName: string,
  columnName: string,
  constraintType: MSSQL_CONSTRAINT_TYPES
) {
  return `
    SELECT
      key_constraints.name as constraintName
    FROM
      sys.key_constraints
      INNER JOIN sys.index_columns ON key_constraints.unique_index_id = index_columns.index_id
      INNER JOIN sys.columns ON index_columns.column_id = columns.column_id
        AND index_columns.object_id = columns.object_id
    WHERE
      key_constraints.type = '${constraintType}'
      AND columns.name = '${columnName}'
      AND key_constraints.parent_object_id = OBJECT_ID('${tableName}');
  `
}

export interface RemoveUniqueConstraintOptions extends BaseConstraintQueryOptions {
  type: "UNIQUE"
  fields: [string]
}

export interface RemoveDefaultConstraintOptions extends BaseConstraintQueryOptions {
  type: "DEFAULT"
}

export interface RemoveCheckConstraintOptions extends BaseConstraintQueryOptions {
  type: "CHECK"
  // where?: WhereOptions<any>;
}

export interface RemovePrimaryKeyConstraintOptions extends BaseConstraintQueryOptions {
  type: "PRIMARY KEY"
  fields: [string]
}

export interface RemoveForeignKeyConstraintOptions extends BaseConstraintQueryOptions {
  type: "FOREIGN KEY"
  fields: [string]
  // references?: {
  //   table: TableName;
  //   field: string;
  // };
  // onDelete: string;
  // onUpdate: string;
}

export type RemoveConstraintOptions =
  | RemoveUniqueConstraintOptions
  | RemoveDefaultConstraintOptions
  | RemoveCheckConstraintOptions
  | RemovePrimaryKeyConstraintOptions
  | RemoveForeignKeyConstraintOptions

// FYI: this is a very minimal implementation, if you want more options,
// you'll need to add them.
export async function removeConstraint(
  queryInterface: MsSqlQueryInterface,
  tableName: string,
  options: RemoveConstraintOptions & RemoveConstraintQueryOptions
) {
  let query
  if (options.type === "FOREIGN KEY") {
    query = findForeignKeyConstraintQuery(tableName, options.fields[0])
  } else if (options.type === "PRIMARY KEY") {
    query = findNonForeignKeyConstraintQuery(
      tableName,
      options.fields[0],
      MSSQL_CONSTRAINT_TYPES.PRIMARY_KEY
    )
  } else if (options.type === "UNIQUE") {
    query = findNonForeignKeyConstraintQuery(
      tableName,
      options.fields[0],
      MSSQL_CONSTRAINT_TYPES.UNIQUE
    )
  } else {
    throw new Error(`Constraint type: ${options.type} NOT IMPLEMENTED`)
  }

  const [results, metadata] = await queryInterface.sequelize.query(query)
  if ((metadata as number) > 1) {
    throw new Error("Unsafe operation, to many results, exiting ...")
  } else if (metadata === 0) {
    console.log("No constraint found, skipping...")
    return
  }

  const constraintName = (results as [{ constraintName: string }])[0].constraintName
  return await queryInterface.removeConstraint(tableName, constraintName)
}
