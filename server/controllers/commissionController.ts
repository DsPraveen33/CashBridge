import { Request, Response } from 'express';
import crypto from 'crypto';
import { db, DBFeeQuote } from '../../src/server/db';

export class CommissionController {
  public static calculateQuote(req: Request, res: Response) {
    const { amount, countryId, paymentMethodId, urgency, distanceKm } = req.body;
    const numAmount = parseFloat(amount) || 2000;

    const rule = db.commissionRules.find(
      r => r.countryId === (countryId || 'in') && r.paymentMethodId === (paymentMethodId || 'upi')
    ) || db.commissionRules[0];

    const baseFee = rule.baseFee;
    const percentageFee = Math.round((numAmount * (rule.percentageFee / 100)) * 100) / 100;
    
    const dist = parseFloat(distanceKm) || 1;
    const distanceFee = dist <= 0.5 ? 0 : Math.round(dist * rule.distanceFeePerKm);

    let urgencyFee = 0;
    if (urgency === 'Within 15 min') urgencyFee = rule.urgencyFee15Min;
    if (urgency === 'Now') urgencyFee = rule.urgencyFeeImmediate;

    const rawSubtotalFee = baseFee + percentageFee + distanceFee + urgencyFee;
    const subtotalFee = Math.max(rule.minimumFee, Math.min(rule.maximumFee, rawSubtotalFee));
    const tax = Math.round((subtotalFee * (rule.taxRatePercent / 100)) * 100) / 100;
    const totalFee = Math.round((subtotalFee + tax) * 100) / 100;
    const finalAmount = numAmount + totalFee;

    const quoteId = `CQ-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const quote: DBFeeQuote = {
      quoteId,
      userId: req.body.userId || 'usr_current',
      exchangeAmount: numAmount,
      currency: rule.currency,
      paymentMethodId: rule.paymentMethodId,
      baseFee,
      percentageFee,
      distanceFee,
      urgencyFee,
      tax,
      totalFee,
      finalAmount,
      status: 'LOCKED',
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    };

    db.feeQuotes.push(quote);

    res.json({
      success: true,
      quote
    });
  }
}
