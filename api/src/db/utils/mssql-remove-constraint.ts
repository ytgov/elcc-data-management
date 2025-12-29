import {
  QueryTypes,
  sql,
  type BaseConstraintQueryOptions,
  type Literal,
  type RemoveConstraintQueryOptions,
} from "@sequelize/core"
import { type MsSqlQueryInterface } from "@sequelize/mssql"

import { type NonEmptyArray } from "@/utils/utility-types"

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
  DEFAULT = "D",
}

function findDefaultConstraintQuery(tableName: string, columnName: string): Literal {
  return sql`
    SELECT
      default_constraints.name AS constraintName
    FROM
      sys.default_constraints
      INNER JOIN sys.columns ON default_constraints.parent_object_id = columns.object_id
      AND default_constraints.parent_column_id = columns.column_id
    WHERE
      default_constraints.parent_object_id = OBJECT_ID(${tableName})
      AND columns.name = ${columnName};
  `
}

function findForeignKeyConstraintQuery(tableName: string, columnName: string): Literal {
  return sql`
    SELECT
      foreign_keys.name AS constraintName
    FROM
      sys.foreign_keys
      INNER JOIN sys.foreign_key_columns ON foreign_keys.object_id = foreign_key_columns.constraint_object_id
      INNER JOIN sys.columns ON foreign_key_columns.parent_column_id = columns.column_id
      AND foreign_key_columns.parent_object_id = columns.object_id
    WHERE
      foreign_keys.parent_object_id = OBJECT_ID(${tableName})
      AND columns.name = ${columnName};
  `
}

function findNonForeignKeyConstraintQuery(
  tableName: string,
  columnName: string,
  constraintType: MSSQL_CONSTRAINT_TYPES
): Literal {
  return sql`
    SELECT
      key_constraints.name as constraintName
    FROM
      sys.key_constraints
      INNER JOIN sys.index_columns ON key_constraints.unique_index_id = index_columns.index_id
      INNER JOIN sys.columns ON index_columns.column_id = columns.column_id
      AND index_columns.object_id = columns.object_id
    WHERE
      key_constraints.type = ${constraintType}
      AND columns.name = ${columnName}
      AND key_constraints.parent_object_id = OBJECT_ID(${tableName});
  `
}

function findMultiFieldNonForeignKeyConstraintQuery(
  tableName: string,
  fields: string[],
  constraintType: MSSQL_CONSTRAINT_TYPES
): Literal {
  const expectedFieldCount = fields.length
  const fieldNamesList = fields.map((fieldName) => `'${fieldName}'`).join(", ")

  return sql`
    SELECT
      key_constraints.name as constraintName
    FROM
      sys.key_constraints AS key_constraints
      INNER JOIN sys.index_columns AS index_columns ON key_constraints.parent_object_id = index_columns.object_id
      AND key_constraints.unique_index_id = index_columns.index_id
      INNER JOIN sys.columns AS columns ON index_columns.object_id = columns.object_id
      AND index_columns.column_id = columns.column_id
    WHERE
      key_constraints.type = ${constraintType}
      AND key_constraints.parent_object_id = OBJECT_ID(${tableName})
    GROUP BY
      key_constraints.name
    HAVING
      COUNT(*) = ${expectedFieldCount}
      AND SUM(
        CASE
          WHEN columns.name IN (${fieldNamesList}) THEN 1
          ELSE 0
        END
      ) = ${expectedFieldCount};
  `
}

export interface RemoveUniqueConstraintOptions extends BaseConstraintQueryOptions {
  type: "UNIQUE"
  fields: NonEmptyArray<string>
}

export interface RemoveDefaultConstraintOptions extends BaseConstraintQueryOptions {
  type: "DEFAULT"
  fields: [string]
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

export interface RemoveConstraintExtraOptions {
  /**
   * When true, removes all matching constraints instead of throwing an error when multiple are found.
   * Use this when you need to clean up duplicate constraints on the same column.
   */
  multiple?: boolean
}

// FYI: this is a very minimal implementation, if you want more options,
// you'll need to add them.
export async function removeConstraint(
  queryInterface: MsSqlQueryInterface,
  tableName: string,
  options: RemoveConstraintOptions & RemoveConstraintQueryOptions & RemoveConstraintExtraOptions
) {
  let query: Literal
  if (options.type === "FOREIGN KEY") {
    query = findForeignKeyConstraintQuery(tableName, options.fields[0])
  } else if (options.type === "PRIMARY KEY") {
    query = findNonForeignKeyConstraintQuery(
      tableName,
      options.fields[0],
      MSSQL_CONSTRAINT_TYPES.PRIMARY_KEY
    )
  } else if (options.type === "UNIQUE") {
    if (options.fields.length === 1) {
      query = findNonForeignKeyConstraintQuery(
        tableName,
        options.fields[0],
        MSSQL_CONSTRAINT_TYPES.UNIQUE
      )
    } else {
      query = findMultiFieldNonForeignKeyConstraintQuery(
        tableName,
        options.fields,
        MSSQL_CONSTRAINT_TYPES.UNIQUE
      )
    }
  } else if (options.type === "DEFAULT") {
    query = findDefaultConstraintQuery(tableName, options.fields[0])
  } else {
    throw new Error(`Constraint type: ${options.type} NOT IMPLEMENTED`)
  }

  const constraintNamesResults = await queryInterface.sequelize.query<{
    constraintName: string
  }>(query, {
    type: QueryTypes.SELECT,
    raw: true,
  })
  const constraintNames = constraintNamesResults.map(({ constraintName }) => constraintName)

  if (constraintNames.length === 0) {
    console.log("No constraint found, skipping...")
    return
  }

  if (constraintNames.length > 1 && options.multiple !== true) {
    throw new Error(
      `Unsafe operation: found ${constraintNames.length} constraints, but multiple=true was not specified. ` +
        `If you want to remove all matching constraints, pass { multiple: true } in options.`
    )
  }

  for (const constraintName of constraintNames) {
    await queryInterface.removeConstraint(tableName, constraintName)
  }
}
