import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type AuditActionType =
  | 'SYSTEM_BOOTSTRAP'
  | 'ADMIN_LOGIN'
  | 'USER_REGISTER'
  | 'USER_SUSPEND'
  | 'USER_UNSUSPEND'
  | 'USER_RESTRICT'
  | 'KYC_SUBMITTED'
  | 'KYC_APPROVE'
  | 'KYC_REJECT'
  | 'KYC_RETRY'
  | 'EXCHANGE_CREATED'
  | 'EXCHANGE_COMPLETED'
  | 'EXCHANGE_DISPUTED'
  | 'COMMISSION_RULE_UPDATED'
  | 'CONFIG_UPDATED';

export type AuditTargetType =
  | 'USER_ACCOUNT'
  | 'USER_KYC'
  | 'EXCHANGE_SESSION'
  | 'PRICING_CONFIG'
  | 'CORE_DATABASE'
  | 'SESSION'
  | 'SYSTEM';

export interface AuditLogAttributes {
  id: string;
  adminId: string;
  adminName: string;
  action: AuditActionType | string;
  targetType: AuditTargetType | string;
  targetId: string;
  details: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuditLogCreationAttributes extends Optional<
  AuditLogAttributes,
  | 'id'
  | 'metadata'
  | 'ipAddress'
  | 'userAgent'
  | 'timestamp'
> {}

export class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  public id!: string;
  public adminId!: string;
  public adminName!: string;
  public action!: string;
  public targetType!: string;
  public targetId!: string;
  public details!: string;
  public metadata?: Record<string, any>;
  public ipAddress?: string;
  public userAgent?: string;
  public timestamp!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: 'Unique UUID identifier for the audit record',
    },
    adminId: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: 'Identifier of the administrator or system process performing the action',
    },
    adminName: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: 'Display name or role title of the actor',
    },
    action: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: 'Type of administrative or compliance action executed',
    },
    targetType: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: 'Category of entity modified (USER_ACCOUNT, USER_KYC, PRICING_CONFIG, etc.)',
    },
    targetId: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: 'Unique ID of the affected resource or record',
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Human-readable explanation and parameter details of the action taken',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Optional JSON payload containing previous and new values for audit diffs',
    },
    ipAddress: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: 'IPv4/IPv6 address of the originating administrator client',
    },
    userAgent: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'HTTP User-Agent of the administrative client',
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Tamper-evident timestamp of when the event occurred',
    },
  },
  {
    sequelize,
    tableName: 'audit_logs',
    timestamps: true,
    indexes: [
      { name: 'idx_audit_admin_id', fields: ['adminId'] },
      { name: 'idx_audit_action', fields: ['action'] },
      { name: 'idx_audit_target_type', fields: ['targetType'] },
      { name: 'idx_audit_target_id', fields: ['targetId'] },
      { name: 'idx_audit_timestamp', fields: ['timestamp'] },
    ],
  }
);
