import { Request, Response } from 'express';
import { openAiAssistant } from '../integrations/openAiAssistant.js';
import { telegramClient } from '../integrations/telegramClient.js';
export const telegramController = { webhook: async (req: Request, res: Response) => { const msg = req.body?.message; if (!msg?.text) return res.status(200).end(); const text = await openAiAssistant.reply(msg.text, String(msg.from?.id ?? '')); await telegramClient.sendMessage(msg.chat.id, text); res.status(200).json({ ok: true }); } };
