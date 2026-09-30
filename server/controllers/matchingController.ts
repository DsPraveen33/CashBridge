import { Request, Response } from 'express';
import { db } from '../../src/server/db';
import { AuthenticatedRequest } from '../middleware/auth';

export class MatchingController {
  public static getMatches(req: Request, res: Response) {
    const { countryId, minAmount } = req.query;

    const matchingPeers = db.users.filter(u => {
      if (u.status !== 'KYC_VERIFIED') return false;
      if (!u.isAvailableProvider) return false;
      if (countryId && u.countryId !== countryId) return false;
      if (minAmount && (u.providerCashAmount < Number(minAmount) && u.providerDigitalAmount < Number(minAmount))) return false;
      return true;
    });

    res.json({
      success: true,
      count: matchingPeers.length,
      matches: matchingPeers
    });
  }

  public static updateAvailability(req: AuthenticatedRequest, res: Response) {
    const user = req.user || db.users[0];
    const { isAvailable, cashAmount, digitalAmount } = req.body;

    user.isAvailableProvider = Boolean(isAvailable);
    if (cashAmount !== undefined) user.providerCashAmount = Number(cashAmount);
    if (digitalAmount !== undefined) user.providerDigitalAmount = Number(digitalAmount);

    res.json({
      success: true,
      isAvailable: user.isAvailableProvider,
      providerCashAmount: user.providerCashAmount,
      providerDigitalAmount: user.providerDigitalAmount,
      message: `Provider status updated to ${user.isAvailableProvider ? 'AVAILABLE' : 'OFFLINE'}`
    });
  }
}
