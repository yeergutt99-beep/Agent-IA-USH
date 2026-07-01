import 'dotenv/config';
import { z } from 'zod';
const schema = z.object({ PORT: z.coerce.number().default(8080), FIREBASE_PROJECT_ID: z.string().optional(), TELEGRAM_BOT_TOKEN: z.string().optional(), OPENAI_API_KEY: z.string().optional(), OPENAI_MODEL: z.string().default('gpt-4.1-mini'), FRONTEND_ORIGIN: z.string().default('*') });
export const env = schema.parse(process.env);
