import { Response } from 'express';
import crypto from 'crypto';
import { db, DBExchangeSession } from '../../src/server/db';
import { AuthenticatedRequest } from '../middleware/auth';

export class ExchangeController {
  public static create(req: AuthenticatedRequest, res: Response) {
    const user = req.user || db.users[0];
    const { peerId, amount, exchangeType, quoteId, paymentMethodId, meetingPointName } = req.body;

    const peer = db.users.find(u => u.id === peerId) || db.users[1];
    const quote = db.feeQuotes.find(q => q.quoteId === quoteId) || db.feeQuotes[0];

    const sessionCode = `CB-${crypto.randomInt(1000, 9999)}`;
    const secPin = `${crypto.randomInt(1000, 9999)}`;

    const session: DBExchangeSession = {
      id: `sess_${Date.now()}`,
      code: sessionCode,
      securityPin: secPin,
      requesterId: user.id,
      providerId: peer.id,
      exchangeType: exchangeType || 'digital_to_cash',
      amount: parseFloat(amount) || (quote ? quote.exchangeAmount : 2000),
      currency: quote ? quote.currency : 'INR',
      paymentMethodId: paymentMethodId || 'upi',
      quoteId: quote ? quote.quoteId : 'CQ-DEFAULT',
      fee: quote ? quote.totalFee : 35,
      status: 'ACCEPTED',
      timelineStep: 3,
      meetingPointName: meetingPointName || 'AITS Main Gate / Central Plaza',
      meetingPointAddress: 'Safe and CCTV monitored public area',
      userConfirmedPayment: false,
      peerConfirmedPayment: false,
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    db.exchangeSessions.push(session);

    db.chatMessages.push({
      id: `msg_sys_${Date.now()}`,
      sessionId: session.id,
      senderId: 'system',
      senderName: 'CashBridge Security',
      text: '🛡️ Safety Reminder: Keep communication inside CashBridge. Never share passwords, bank OTPs, or private addresses.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSecurityAlert: true
    });

    res.json({
      success: true,
      session,
      peer
    });
  }

  public static advance(req: AuthenticatedRequest, res: Response) {
    const session = db.exchangeSessions.find(s => s.id === req.params.id || s.code === req.params.id) || db.exchangeSessions[0];
    if (!session) {
      return res.status(404).json({ success: false, message: 'Exchange session not found' });
    }

    if (session.timelineStep === 3) {
      session.timelineStep = 4;
      session.status = 'MEETING_CONFIRMED';
    } else if (session.timelineStep === 4) {
      session.timelineStep = 5;
      session.status = 'EXCHANGE_STARTED';
    } else if (session.timelineStep === 5) {
      session.timelineStep = 6;
      session.status = 'PAYMENT_PENDING';
    }

    res.json({ success: true, session });
  }

  public static confirmPayment(req: AuthenticatedRequest, res: Response) {
    const session = db.exchangeSessions.find(s => s.id === req.params.id || s.code === req.params.id) || db.exchangeSessions[0];
    if (!session) {
      return res.status(404).json({ success: false, message: 'Exchange session not found' });
    }

    session.timelineStep = 7;
    session.status = 'COMPLETED';
    session.userConfirmedPayment = true;
    session.peerConfirmedPayment = true;
    session.completedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const requester = db.users.find(u => u.id === session.requesterId);
    const provider = db.users.find(u => u.id === session.providerId);

    if (requester) {
      requester.completedExchanges += 1;
      requester.trustScore = Math.min(100, requester.trustScore + 1);
    }
    if (provider) {
      provider.completedExchanges += 1;
      provider.trustScore = Math.min(100, provider.trustScore + 1);
    }

    res.json({
      success: true,
      session,
      message: 'Exchange completed successfully. Trust reputation updated.'
    });
  }

  public static dispute(req: AuthenticatedRequest, res: Response) {
    const { reason, details, reportedBy } = req.body;
    const session = db.exchangeSessions.find(s => s.id === req.params.id || s.code === req.params.id) || db.exchangeSessions[0];

    if (session) {
      session.status = 'DISPUTED';
      session.disputeReason = reason;
    }

    const dispute = {
      id: `disp_${Date.now()}`,
      exchangeId: session ? session.code : 'CB-GENERAL',
      reportedBy: reportedBy || 'User',
      reportedUserId: session ? session.providerId : 'usr_peer',
      reason: reason || 'Payment Dispute',
      details: details || 'User did not receive confirmed digital transfer',
      status: 'PENDING_REVIEW' as const,
      createdAt: new Date().toISOString()
    };

    db.disputes.push(dispute);

    res.json({
      success: true,
      dispute,
      message: 'Dispute filed successfully.'
    });
  }
}
