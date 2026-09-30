import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Sequelize with PostgreSQL or connection pooling
export const sequelize = dbUrl
  ? new Sequelize(dbUrl, {
      dialect: 'postgres',
      logging: !isProduction ? console.log : false,
      dialectOptions: isProduction
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          }
        : {},
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  : new Sequelize(
      process.env.PGDATABASE || 'cashbridge_db',
      process.env.PGUSER || 'postgres',
      process.env.PGPASSWORD || 'postgres',
      {
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT || '5432'),
        dialect: 'postgres',
        logging: false,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );

export async function testDbConnection(): Promise<boolean> {
  try {
    await sequelize.authenticate();
    console.log('✅ [Sequelize] PostgreSQL Database connection established successfully.');
    return true;
  } catch (error) {
    console.warn('⚠️ [Sequelize] PostgreSQL not available on localhost:5432, running with In-Memory / High-Availability fallback mode.', error);
    return false;
  }
}
