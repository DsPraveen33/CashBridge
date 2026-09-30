import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface CommissionRuleAttributes {
  id: string;
  name: string;
  countryId: string;
  currency: string;
  paymentMethodId: string;
  baseFee: number;
  percentageFee: number;
  distanceFeePerKm: number;
  urgencyFee15Min: number;
  urgencyFeeImmediate: number;
  minimumFee: number;
  maximumFee: number;
  taxRatePercent: number;
  updatedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommissionRuleCreationAttributes extends Optional<CommissionRuleAttributes, 'id'> {}

export class CommissionRule extends Model<CommissionRuleAttributes, CommissionRuleCreationAttributes> implements CommissionRuleAttributes {
  public id!: string;
  public name!: string;
  public countryId!: string;
  public currency!: string;
  public paymentMethodId!: string;
  public baseFee!: number;
  public percentageFee!: number;
  public distanceFeePerKm!: number;
  public urgencyFee15Min!: number;
  public urgencyFeeImmediate!: number;
  public minimumFee!: number;
  public maximumFee!: number;
  public taxRatePercent!: number;
  public updatedBy!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CommissionRule.init(
  {
    id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    countryId: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: 'INR',
    },
    paymentMethodId: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: 'upi',
    },
    baseFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 15.0,
    },
    percentageFee: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 1.0,
    },
    distanceFeePerKm: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 10.0,
    },
    urgencyFee15Min: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 10.0,
    },
    urgencyFeeImmediate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 20.0,
    },
    minimumFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 20.0,
    },
    maximumFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 150.0,
    },
    taxRatePercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 18.0,
    },
    updatedBy: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: 'SUPER_ADMIN',
    },
  },
  {
    sequelize,
    tableName: 'commission_rules',
    indexes: [
      { fields: ['countryId'] },
      { fields: ['paymentMethodId'] },
    ],
  }
);
