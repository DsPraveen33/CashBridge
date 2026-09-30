import { sequelize } from '../config/database';
import { User } from './User';
import { KYCProfile } from './KYCProfile';
import { ExchangeRequest } from './ExchangeRequest';
import { AuditLog } from './AuditLog';
import { CommissionRule } from './CommissionRule';

// -------------------------------------------------------------
// Relational Definitions & Foreign Key Constraints
// -------------------------------------------------------------

// 1. User <-> KYCProfile (One-to-One with cascade delete)
User.hasOne(KYCProfile, {
  foreignKey: 'userId',
  as: 'kycProfile',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

KYCProfile.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// 2. User <-> ExchangeRequest (One-to-Many as Requester)
User.hasMany(ExchangeRequest, {
  foreignKey: 'requesterId',
  as: 'requestedExchanges',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

ExchangeRequest.belongsTo(User, {
  foreignKey: 'requesterId',
  as: 'requester',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// 3. User <-> ExchangeRequest (One-to-Many as Provider)
User.hasMany(ExchangeRequest, {
  foreignKey: 'providerId',
  as: 'providedExchanges',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

ExchangeRequest.belongsTo(User, {
  foreignKey: 'providerId',
  as: 'provider',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// -------------------------------------------------------------
// Compatibility Aliases
// -------------------------------------------------------------
export const Exchange = ExchangeRequest;
export const KycProfile = KYCProfile;

// -------------------------------------------------------------
// Schema Synchronization Utility
// -------------------------------------------------------------
export async function syncDatabase(force = false): Promise<void> {
  try {
    await sequelize.sync({ force, alter: !force });
    console.log('✅ [Sequelize] Core database schema synchronized successfully:');
    console.log('   ├── users (User)');
    console.log('   ├── kyc_profiles (KYCProfile)');
    console.log('   ├── exchange_requests (ExchangeRequest)');
    console.log('   ├── audit_logs (AuditLog)');
    console.log('   └── commission_rules (CommissionRule)');
  } catch (error) {
    console.warn('⚠️ [Sequelize] Database synchronization notice (in-memory mode active if PostgreSQL is offline):', error);
  }
}

export {
  sequelize,
  User,
  KYCProfile,
  ExchangeRequest,
  AuditLog,
  CommissionRule,
};
