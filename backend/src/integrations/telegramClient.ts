import { env } from '../config/env.js';
export class TelegramClient { async sendMessage(chatId: string | number, text: string){ if(!env.TELEGRAM_BOT_TOKEN) return; await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: chatId, text }) }); } }
export const telegramClient = new TelegramClient();
