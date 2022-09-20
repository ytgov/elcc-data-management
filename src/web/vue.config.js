var dotenv = require('dotenv')

let path;
switch (process.env.NODE_ENV) {
  case "test":
    path = `../.env.uat`;
    break;
  case "production":
    path = `../.env.production`;
    break;
  default:
    path = `../.env.development`;
}


dotenv.config({ path: path });

