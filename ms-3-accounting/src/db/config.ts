// eslint-disable-next-line @typescript-eslint/no-var-requires
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });

const {
  MS_CFG_POSTGRES_DB,
  MS_CFG_POSTGRES_USER,
  MS_CFG_POSTGRES_PASSWORD,
  MS_CFG_POSTGRES_HOST,
  MS_CFG_POSTGRES_OUT_PORT,
} = process.env;

const config = {
  dialect: "postgres",
  username: MS_CFG_POSTGRES_USER,
  password: MS_CFG_POSTGRES_PASSWORD,
  host: MS_CFG_POSTGRES_HOST,
  database: MS_CFG_POSTGRES_DB,
  port: MS_CFG_POSTGRES_OUT_PORT,
  seederStorage: "sequelize",
  migrationStorage: "sequelize",
  seederStorageTableName: "AccountsServiceSeeds",
  migrationStorageTableName: "AccountsServiceSeeds",
  logging: false,
  define: {
    freezeTableName: true,
  },
  sync: false,
  dialectOptions: {
    useUTC: true, // For reading from database
  },
  timezone: "+00:00", // For writing to database
};
export default config;
