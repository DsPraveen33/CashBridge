import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';
const hasExplicitDbConfig = Boolean(
  dbUrl || (process.env.PGHOST && process.env.PGHOST !== 'localhost' && process.env.PGHOST !== '127.0.0.1')
);

export const sequelize = dbUrl
  ? new Sequelize(dbUrl, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: isProduction
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          }
        : {},
      retry: { max: 0 },
      pool: {
        max: 5,
        min: 0,
        acquire: 5000,
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
        retry: { max: 0 },
        pool: {
          max: 5,
          min: 0,
          acquire: 5000,
          idle: 10000
        }
      }
    );

/**
 * Validates database connectivity gracefully.
 * In environments without a live PostgreSQL instance, runs cleanly in in-memory mode.
 */
export async function testDbConnection(): Promise<boolean> {
  // If no explicit remote DB or Cloud SQL is configured, bypass local TCP port probe
  if (!hasExplicitDbConfig && !process.env.DATABASE_URL) {
    console.log('ℹ️ [CashBridge DB] In-memory persistence engine loaded (Production PostgreSQL active when DATABASE_URL or Cloud SQL is configured).');
    return false;
  }

  try {
    await sequelize.authenticate();
    console.log('✅ [Sequelize] PostgreSQL Database connection established successfully.');
    return true;
  } catch (error) {
    console.log('ℹ️ [CashBridge DB] Remote PostgreSQL host unreachable; running seamlessly on in-memory persistence fallback.');
    return false;
  }
}
