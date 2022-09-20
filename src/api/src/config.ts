import * as dotenv from "dotenv";
import { Knex } from "knex";

export const NODE_ENV = process.env.NODE_ENV || "development";

let path;
switch (process.env.NODE_ENV) {
  case "test":
    path = `../../.env.test`;
    break;
  case "production":
    path = `../../.env.production`;
    break;
  default:
    path = `../../.env.development`;
}

dotenv.config({ path: path });

// Filter out the variables that the frontend needs to know about
let obj = process.env;
let pattern = "VUE_APP_";

export const VUE_APP: any = Object.keys(obj)
  .filter((k) => k.includes(pattern))
  .reduce((cur, key) => {
    return Object.assign(cur, { [key]: obj[key] });
  }, {});

console.log(`LOADING ${NODE_ENV} CONFIG FROM ${path}`);
export const apiBaseUrl = process.env.NODE_ENV == "production" ? "" : "http://localhost:3000";
export const API_PORT = process.env.API_PORT || "3000";
export const VUE_APP_FRONTEND_URL = process.env.VUE_APP_FRONTEND_URL || "";

export const APPLICATION_NAME = process.env.APPLICATION_NAME || "";

export const DB_CONFIG: Knex.Config<any> = {
  client: "mssql",
  connection: {
    server: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "1433"),
  },
};
