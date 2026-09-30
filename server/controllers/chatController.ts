import { Request, Response } from 'express';
import { db, DBChatMessage } from '../../src/server/db';

export class ChatController {
  public static getMessages(req: Request, res: Response) {
    const msgs = db.chatMessages.filter(m => m.sessionId === req.params.sessionId || req.params.sessionId === 'default');
    res.json({ success: true, messages: msgs.length ? msgs : db.chatMessages });
  }

  public static sendMessage(req: Request, res: Response) {
    const { senderId, senderName, text } = req.body;
    const newMsg: DBChatMessage = {
      id: `msg_${Date.now()}`,
      sessionId: req.params.sessionId,
      senderId: senderId || 'user',
      senderName: senderName || 'Praveen N',
      text: text || '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    db.chatMessages.push(newMsg);

    res.json({ success: true, message: newMsg });
  }
}
