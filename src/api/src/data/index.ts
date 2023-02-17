import knex from "knex";
import { DB_CONFIG } from "../config";

export const db = knex(DB_CONFIG);

export * from "./migration-manager";
