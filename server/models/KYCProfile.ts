import { DataTypes, Model, Optional, BelongsToGetAssociationMixin } from 'sequelize';
import { sequelize } from '../config/database';
import type { User } from './User';

export type KYCStatus = 
  | 'NOT_STARTED' 
  | 'PENDING' 
  | 'IN_REVIEW' 
  | 'VERIFIED' 
  | 'REJECTED' 
  | 'RETRY_REQUIRED';

export type KYCDocumentType = 
  | 'Aadhaar Card (India)'
  | 'Passport (International)'
  | 'Driving License'
  | 'National Identity Card'
  | 'Voter ID';

export interface KYCProfileAttributes {
  id: string;
  userId: string;
  documentType: KYCDocumentType;
  idReference: string;
  frontDocumentUrl?: string;
  backDocumentUrl?: string;
  selfieImageUrl?: string;
  frontUploaded: boolean;
  backUploaded: boolean;
  selfieVerified: boolean;
  providerReference: string;
  status: KYCStatus;
  rejectionReason?: string;
  reviewerAdminId?: string;
  submittedAt: Date;
  verifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface KYCProfileCreationAttributes extends Optional<
  KYCProfileAttributes, 
  | 'id' 
  | 'frontDocumentUrl'
  | 'backDocumentUrl'
  | 'selfieImageUrl'
  | 'frontUploaded' 
  | 'backUploaded' 
  | 'selfieVerified' 
  | 'status' 
  | 'rejectionReason' 
  | 'reviewerAdminId' 
  | 'verifiedAt'
> {}

export class KYCProfile extends Model<KYCProfileAttributes, KYCProfileCreationAttributes> implements KYCProfileAttributes {
  public id!: string;
  public userId!: string;
  public documentType!: KYCDocumentType;
  public idReference!: string;
  public frontDocumentUrl?: string;
  public backDocumentUrl?: string;
  public selfieImageUrl?: string;
  public frontUploaded!: boolean;
  public backUploaded!: boolean;
  public selfieVerified!: boolean;
  public providerReference!: string;
  public status!: KYCStatus;
  public rejectionReason?: string;
  public reviewerAdminId?: string;
  public submittedAt!: Date;
  public verifiedAt?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association mixin
  public getUser!: BelongsToGetAssociationMixin<User>;
}

KYCProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: 'Primary UUID for KYC record',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      comment: 'Foreign key referencing users table (1:1 relationship)',
    },
    documentType: {
      type: DataTypes.ENUM(
        'Aadhaar Card (India)',
        'Passport (International)',
        'Driving License',
        'National Identity Card',
        'Voter ID'
      ),
      allowNull: false,
      defaultValue: 'Aadhaar Card (India)',
      comment: 'Type of official government identification submitted',
    },
    idReference: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: 'Masked or hashed government identification number',
    },
    frontDocumentUrl: {
      type: DataTypes.STRING(512),
      allowNull: true,
      comment: 'Secure encrypted object storage URL for front of ID',
    },
    backDocumentUrl: {
      type: DataTypes.STRING(512),
      allowNull: true,
      comment: 'Secure encrypted object storage URL for back of ID',
    },
    selfieImageUrl: {
      type: DataTypes.STRING(512),
      allowNull: true,
      comment: 'Secure encrypted object storage URL for 3D selfie liveness capture',
    },
    frontUploaded: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Flag indicating front document capture is completed',
    },
    backUploaded: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Flag indicating back document capture is completed',
    },
    selfieVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Biometric liveness anti-spoofing verification result',
    },
    providerReference: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: 'Third-party KYC provider verification session token (Veriff/Onfido)',
    },
    status: {
      type: DataTypes.ENUM(
        'NOT_STARTED',
        'PENDING',
        'IN_REVIEW',
        'VERIFIED',
        'REJECTED',
        'RETRY_REQUIRED'
      ),
      allowNull: false,
      defaultValue: 'PENDING',
      comment: 'Compliance status of the identity verification request',
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Compliance explanation in case of rejection or retry request',
    },
    reviewerAdminId: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: 'Admin user ID who approved/reviewed the verification',
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Timestamp when documents were transmitted to verification provider',
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Timestamp when verification was finalized and approved',
    },
  },
  {
    sequelize,
    tableName: 'kyc_profiles',
    timestamps: true,
    indexes: [
      { name: 'idx_kyc_user_id', unique: true, fields: ['userId'] },
      { name: 'idx_kyc_status', fields: ['status'] },
      { name: 'idx_kyc_provider_reference', fields: ['providerReference'] },
      { name: 'idx_kyc_submitted_at', fields: ['submittedAt'] },
    ],
  }
);
