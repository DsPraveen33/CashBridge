import dotenv from 'dotenv';
import { createApp } from './app';
import { testDbConnection } from './config/database';
import { syncDatabase } from './models';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

export async function startServer() {
  try {
    const isDbConnected = await testDbConnection();
    if (isDbConnected) {
      await syncDatabase();
    }

    const app = await createApp();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 [CashBridge Server] Express backend running at http://0.0.0.0:${PORT}`);
      console.log(`📦 [CashBridge Architecture] Sequelize PostgreSQL models & modular routes initialized.`);
    });
  } catch (error) {
    console.error('❌ [CashBridge Server] Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
