import { DataTypes, Model, Optional, HasOneGetAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import { sequelize } from '../config/database';
import type { KYCProfile } from './KYCProfile';
import type { ExchangeRequest } from './ExchangeRequest';
import type { AuditLog } from './AuditLog';

export type UserStatus = 
  | 'NEW' 
  | 'EMAIL_PHONE_VERIFIED' 
  | 'KYC_PENDING' 
  | 'KYC_IN_REVIEW' 
  | 'KYC_VERIFIED' 
  | 'KYC_REJECTED' 
  | 'RESTRICTED' 
  | 'SUSPENDED';

export type UserRole = 
  | 'USER' 
  | 'ADMIN' 
  | 'SUPER_ADMIN' 
  | 'KYC_REVIEWER' 
  | 'MODERATOR' 
  | 'PRICING_ADMIN';

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  phone: string;
  countryId: string;
  city: string;
  community: string;
  passwordHash: string;
  salt?: string;
  status: UserStatus;
  role: UserRole;
  avatar: string;
  trustScore: number;
  completedExchanges: number;
  rating: number;
  reviewsCount: number;
  isAvailableProvider: boolean;
  providerCashAmount: number;
  providerDigitalAmount: number;
  locationName: string;
  approxDistanceMeters: number;
  memberSince: string;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<
  UserAttributes, 
  | 'id' 
  | 'salt'
  | 'status' 
  | 'role' 
  | 'avatar'
  | 'trustScore' 
  | 'completedExchanges' 
  | 'rating' 
  | 'reviewsCount' 
  | 'isAvailableProvider' 
  | 'providerCashAmount' 
  | 'providerDigitalAmount' 
  | 'approxDistanceMeters' 
  | 'memberSince'
  | 'lastLoginAt'
> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public phone!: string;
  public countryId!: string;
  public city!: string;
  public community!: string;
  public passwordHash!: string;
  public salt?: string;
  public status!: UserStatus;
  public role!: UserRole;
  public avatar!: string;
  public trustScore!: number;
  public completedExchanges!: number;
  public rating!: number;
  public reviewsCount!: number;
  public isAvailableProvider!: boolean;
  public providerCashAmount!: number;
  public providerDigitalAmount!: number;
  public locationName!: string;
  public approxDistanceMeters!: number;
  public memberSince!: string;
  public lastLoginAt?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association mixins
  public getKYCProfile!: HasOneGetAssociationMixin<KYCProfile>;
  public getRequestedExchanges!: HasManyGetAssociationsMixin<ExchangeRequest>;
  public getProvidedExchanges!: HasManyGetAssociationsMixin<ExchangeRequest>;
  public getAuditLogs!: HasManyGetAssociationsMixin<AuditLog>;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: 'Unique UUID identifier for the user',
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 128],
      },
      comment: 'Legal full name matching official government identification',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
      comment: 'Unique user email address',
    },
    phone: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
      comment: 'E.164 formatted unique mobile phone number',
    },
    countryId: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: 'in',
      comment: 'ISO 2-letter country code (in, us, uk, ca, ae, sg)',
    },
    city: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: 'Hyderabad',
      comment: 'Primary operating city or campus municipality',
    },
    community: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: 'Campus & Local Community',
      comment: 'Verified college campus or local verified community cluster',
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Salted cryptographic PBKDF2/Argon2 password hash',
    },
    salt: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: 'Per-user unique cryptographic salt',
    },
    status: {
      type: DataTypes.ENUM(
        'NEW',
        'EMAIL_PHONE_VERIFIED',
        'KYC_PENDING',
        'KYC_IN_REVIEW',
        'KYC_VERIFIED',
        'KYC_REJECTED',
        'RESTRICTED',
        'SUSPENDED'
      ),
      allowNull: false,
      defaultValue: 'KYC_PENDING',
      comment: 'Current KYC and safety compliance state',
    },
    role: {
      type: DataTypes.ENUM(
        'USER',
        'ADMIN',
        'SUPER_ADMIN',
        'KYC_REVIEWER',
        'MODERATOR',
        'PRICING_ADMIN'
      ),
      allowNull: false,
      defaultValue: 'USER',
      comment: 'RBAC Authorization role for application and administrative actions',
    },
    avatar: {
      type: DataTypes.STRING(512),
      allowNull: false,
      defaultValue: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      comment: 'Profile avatar image CDN URL',
    },
    trustScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 85,
      validate: {
        min: 0,
        max: 100,
      },
      comment: 'Peer-reviewed reputation score out of 100',
    },
    completedExchanges: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Total number of successfully verified and completed exchanges',
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 5.0,
      validate: {
        min: 1.0,
        max: 5.0,
      },
      comment: 'Average star rating out of 5.0',
    },
    reviewsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Count of received reviews from peer exchangers',
    },
    isAvailableProvider: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Provider availability mode toggle (I Can Help)',
    },
    providerCashAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Physical cash liquidity available for exchange',
    },
    providerDigitalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Digital payment balance available for exchange',
    },
    locationName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'Local Public Zone',
      comment: 'Landmark or safe public zone description',
    },
    approxDistanceMeters: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 200,
      comment: 'Approximate radius distance from hub',
    },
    memberSince: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: 'Today',
      comment: 'Human-readable membership tenure',
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Timestamp of most recent authenticated session',
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    indexes: [
      { name: 'idx_users_email', unique: true, fields: ['email'] },
      { name: 'idx_users_phone', unique: true, fields: ['phone'] },
      { name: 'idx_users_status', fields: ['status'] },
      { name: 'idx_users_country_id', fields: ['countryId'] },
      { name: 'idx_users_provider_available', fields: ['isAvailableProvider'] },
    ],
  }
);
