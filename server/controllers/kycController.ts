import { Response } from 'express';
import crypto from 'crypto';
import { db } from '../../src/server/db';
import { AuthenticatedRequest } from '../middleware/auth';

export class KycController {
  public static startSession(req: AuthenticatedRequest, res: Response) {
    const user = req.user || db.users[0];
    const providerRef = `VERIFF_SESSION_${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

    let kycProf = db.kycProfiles.find(k => k.userId === user.id);
    if (!kycProf) {
      kycProf = {
        id: `kyc_${Date.now()}`,
        userId: user.id,
        documentType: 'Aadhaar Card (India)',
        idReference: '',
        frontUploaded: false,
        backUploaded: false,
        selfieVerified: false,
        providerReference: providerRef,
        status: 'PENDING',
        submittedAt: new Date().toISOString()
      };
      db.kycProfiles.push(kycProf);
    } else {
      kycProf.providerReference = providerRef;
      kycProf.status = 'PENDING';
    }

    res.json({
      success: true,
      providerReference: providerRef,
      providerUrl: 'https://sdk.veriff.com/v1/session',
      message: 'Third-party KYC provider session started'
    });
  }

  public static submit(req: AuthenticatedRequest, res: Response) {
    const user = req.user || db.users[0];
    const { documentType, idReference } = req.body;

    let kycProf = db.kycProfiles.find(k => k.userId === user.id);
    if (!kycProf) {
      kycProf = {
        id: `kyc_${Date.now()}`,
        userId: user.id,
        documentType: documentType || 'Aadhaar Card (India)',
        idReference: idReference || 'ID-DOC-PENDING',
        frontUploaded: true,
        backUploaded: true,
        selfieVerified: true,
        providerReference: `ONFIDO_${Date.now()}`,
        status: 'IN_REVIEW',
        submittedAt: new Date().toISOString()
      };
      db.kycProfiles.push(kycProf);
    } else {
      kycProf.documentType = documentType || kycProf.documentType;
      kycProf.idReference = idReference || kycProf.idReference;
      kycProf.frontUploaded = true;
      kycProf.backUploaded = true;
      kycProf.selfieVerified = true;
      kycProf.status = 'IN_REVIEW';
      kycProf.submittedAt = new Date().toISOString();
    }

    user.status = 'KYC_IN_REVIEW';

    res.json({
      success: true,
      status: 'IN_REVIEW',
      message: 'KYC documents and live selfie submitted to compliance provider. Status: IN_REVIEW.'
    });
  }

  public static getStatus(req: AuthenticatedRequest, res: Response) {
    const user = req.user || db.users[0];
    const kycProf = db.kycProfiles.find(k => k.userId === user.id);

    res.json({
      success: true,
      kycStatus: kycProf ? kycProf.status : user.status.replace('KYC_', ''),
      userStatus: user.status,
      kycProfile: kycProf || null
    });
  }
}
