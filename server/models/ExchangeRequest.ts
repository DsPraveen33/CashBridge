import { DataTypes, Model, Optional, BelongsToGetAssociationMixin } from 'sequelize';
import { sequelize } from '../config/database';
import type { User } from './User';

export type ExchangeType = 'digital_to_cash' | 'cash_to_digital';

export type ExchangeStatus = 
  | 'REQUESTED'
  | 'MATCHED'
  | 'ACCEPTED'
  | 'MEETING_CONFIRMED'
  | 'EXCHANGE_STARTED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export type PaymentMethodRail = 
  | 'upi' 
  | 'imps' 
  | 'zelle' 
  | 'venmo' 
  | 'cashapp' 
  | 'faster_payments' 
  | 'revolut_uk' 
  | 'interac' 
  | 'uae_instant' 
  | 'paynow'
  | 'bank_transfer';

export interface ExchangeRequestAttributes {
  id: string;
  code: string;
  securityPin: string;
  requesterId: string;
  providerId: string;
  exchangeType: ExchangeType;
  amount: number;
  currency: string;
  paymentMethodId: PaymentMethodRail | string;
  quoteId: string;
  baseFee: number;
  percentageFee: number;
  distanceFee: number;
  urgencyFee: number;
  taxAmount: number;
  totalFee: number;
  status: ExchangeStatus;
  timelineStep: number;
  meetingPointName: string;
  meetingPointAddress: string;
  meetingPointLat?: number;
  meetingPointLng?: number;
  userConfirmedPayment: boolean;
  peerConfirmedPayment: boolean;
  ratingGiven?: number;
  ratingTags?: string[];
  feedbackNotes?: string;
  disputeReason?: string;
  disputeDetails?: string;
  startedAt: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExchangeRequestCreationAttributes extends Optional<
  ExchangeRequestAttributes,
  | 'id'
  | 'status'
  | 'timelineStep'
  | 'baseFee'
  | 'percentageFee'
  | 'distanceFee'
  | 'urgencyFee'
  | 'taxAmount'
  | 'totalFee'
  | 'meetingPointLat'
  | 'meetingPointLng'
  | 'userConfirmedPayment'
  | 'peerConfirmedPayment'
  | 'ratingGiven'
  | 'ratingTags'
  | 'feedbackNotes'
  | 'disputeReason'
  | 'disputeDetails'
  | 'completedAt'
  | 'cancelledAt'
> {}

export class ExchangeRequest extends Model<ExchangeRequestAttributes, ExchangeRequestCreationAttributes> implements ExchangeRequestAttributes {
  public id!: string;
  public code!: string;
  public securityPin!: string;
  public requesterId!: string;
  public providerId!: string;
  public exchangeType!: ExchangeType;
  public amount!: number;
  public currency!: string;
  public paymentMethodId!: string;
  public quoteId!: string;
  public baseFee!: number;
  public percentageFee!: number;
  public distanceFee!: number;
  public urgencyFee!: number;
  public taxAmount!: number;
  public totalFee!: number;
  public status!: ExchangeStatus;
  public timelineStep!: number;
  public meetingPointName!: string;
  public meetingPointAddress!: string;
  public meetingPointLat?: number;
  public meetingPointLng?: number;
  public userConfirmedPayment!: boolean;
  public peerConfirmedPayment!: boolean;
  public ratingGiven?: number;
  public ratingTags?: string[];
  public feedbackNotes?: string;
  public disputeReason?: string;
  public disputeDetails?: string;
  public startedAt!: Date;
  public completedAt?: Date;
  public cancelledAt?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association mixins
  public getRequester!: BelongsToGetAssociationMixin<User>;
  public getProvider!: BelongsToGetAssociationMixin<User>;
}

ExchangeRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: 'Unique UUID primary key for the exchange request',
    },
    code: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
      comment: 'Human-readable session tracking code (e.g., CB-4821)',
    },
    securityPin: {
      type: DataTypes.STRING(16),
      allowNull: false,
      comment: '4-digit secret cryptographic pin for in-person handshake verification',
    },
    requesterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      comment: 'Foreign key to users table for party requesting exchange',
    },
    providerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      comment: 'Foreign key to users table for peer providing liquidity',
    },
    exchangeType: {
      type: DataTypes.ENUM('digital_to_cash', 'cash_to_digital'),
      allowNull: false,
      defaultValue: 'digital_to_cash',
      comment: 'Direction of exchange (digital_to_cash: User pays digital and gets cash; cash_to_digital: User pays cash and gets digital)',
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 1,
      },
      comment: 'Principal exchange volume in regional currency',
    },
    currency: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: 'INR',
      comment: '3-letter ISO currency code (INR, USD, GBP, CAD, AED, SGD)',
    },
    paymentMethodId: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: 'upi',
      comment: 'Selected digital rail (upi, imps, zelle, venmo, faster_payments, etc.)',
    },
    quoteId: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: 'Locked Dynamic Commission Engine quote identifier (CQ-XXXXXX)',
    },
    baseFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 15.0,
      comment: 'Base fixed transaction fee calculated by pricing engine',
    },
    percentageFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 20.0,
      comment: 'Percentage-based transaction fee calculated by pricing engine',
    },
    distanceFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      comment: 'Distance radius fee component',
    },
    urgencyFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      comment: 'Instant/Urgent execution fee component',
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      comment: 'Applicable regional tax/GST/VAT fee',
    },
    totalFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 35.0,
      comment: 'Final locked total commission fee payable to CashBridge platform',
    },
    status: {
      type: DataTypes.ENUM(
        'REQUESTED',
        'MATCHED',
        'ACCEPTED',
        'MEETING_CONFIRMED',
        'EXCHANGE_STARTED',
        'PAYMENT_PENDING',
        'PAYMENT_CONFIRMED',
        'COMPLETED',
        'CANCELLED',
        'DISPUTED'
      ),
      allowNull: false,
      defaultValue: 'REQUESTED',
      comment: '7-step Exchange State Machine progression status',
    },
    timelineStep: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 7,
      },
      comment: 'Current numeric progress step on the 7-step mobile timeline',
    },
    meetingPointName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'AITS Main Gate / Central Plaza',
      comment: 'Designated safe public meeting location name',
    },
    meetingPointAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'Safe and CCTV monitored public area',
      comment: 'Detailed address and landmark instructions',
    },
    meetingPointLat: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
      comment: 'Latitude coordinate of safe spot',
    },
    meetingPointLng: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
      comment: 'Longitude coordinate of safe spot',
    },
    userConfirmedPayment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Confirmation by requester of receipt of funds',
    },
    peerConfirmedPayment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Confirmation by provider of receipt of funds',
    },
    ratingGiven: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
      comment: 'Post-exchange star review (1-5)',
    },
    ratingTags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
      comment: 'Praise and reputation tags (Fast Response, Punctual, etc.)',
    },
    feedbackNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Optional user review comments',
    },
    disputeReason: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Dispute category if transaction is contested',
    },
    disputeDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Detailed dispute notes for moderation investigation',
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Session initiation timestamp',
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Handshake completion and consensus timestamp',
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Cancellation timestamp if session aborted',
    },
  },
  {
    sequelize,
    tableName: 'exchange_requests',
    timestamps: true,
    indexes: [
      { name: 'idx_exchanges_code', unique: true, fields: ['code'] },
      { name: 'idx_exchanges_requester_id', fields: ['requesterId'] },
      { name: 'idx_exchanges_provider_id', fields: ['providerId'] },
      { name: 'idx_exchanges_status', fields: ['status'] },
      { name: 'idx_exchanges_quote_id', fields: ['quoteId'] },
      { name: 'idx_exchanges_started_at', fields: ['startedAt'] },
    ],
  }
);
