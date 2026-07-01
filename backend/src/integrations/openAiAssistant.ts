import OpenAI from 'openai';
import { env } from '../config/env.js';
import { reservationService } from '../services/reservationService.js';
const tools: OpenAI.Responses.Tool[] = [
  { type:'function', name:'checkAvailability', description:'Verifica disponibilidad antes de reservar', parameters:{type:'object',properties:{fecha:{type:'string'},hora:{type:'string'},cantidadPersonas:{type:'number'}},required:['fecha','hora','cantidadPersonas'],additionalProperties:false}, strict:true },
  { type:'function', name:'createReservation', description:'Crea una reserva tras verificar disponibilidad', parameters:{type:'object',properties:{cliente:{type:'object',properties:{nombre:{type:'string'},telefono:{type:'string'},telegramId:{type:'string'}},required:['nombre','telefono'],additionalProperties:false},fecha:{type:'string'},hora:{type:'string'},cantidadPersonas:{type:'number'},observaciones:{type:'string'}},required:['cliente','fecha','hora','cantidadPersonas'],additionalProperties:false}, strict:true },
  { type:'function', name:'searchReservation', description:'Busca reservas', parameters:{type:'object',properties:{fecha:{type:'string'},estado:{type:'string'},customerId:{type:'string'}},additionalProperties:false}, strict:false },
  { type:'function', name:'getRestaurantRules', description:'Obtiene reglas del restaurante', parameters:{type:'object',properties:{},additionalProperties:false}, strict:true },
  { type:'function', name:'getCurrentDate', description:'Obtiene la fecha actual ISO', parameters:{type:'object',properties:{},additionalProperties:false}, strict:true }
];
export class OpenAiAssistant { private client = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;
  async reply(message: string, telegramId?: string){ if(!this.client) return 'El asistente no está configurado. Contactá al restaurante.';
    let response = await this.client.responses.create({ model: env.OPENAI_MODEL, input: message, tools, instructions: `Sos un asistente de reservas de restaurante. Nunca confirmes reservas sin llamar antes a checkAvailability. Pedí nombre y teléfono si faltan. El backend valida todo; no inventes disponibilidad. TelegramId: ${telegramId ?? 'desconocido'}.` });
    for (let i=0;i<4;i++) {
      const calls = response.output.filter(o => o.type === 'function_call'); if (!calls.length) break;
      const outputs = await Promise.all(calls.map(async call => ({ type:'function_call_output' as const, call_id: call.call_id, output: JSON.stringify(await this.execute(call.name, JSON.parse(call.arguments || '{}'), telegramId)) })));
      response = await this.client.responses.create({ model: env.OPENAI_MODEL, previous_response_id: response.id, input: outputs, tools });
    }
    return response.output_text || 'No pude procesar la solicitud.';
  }
  private async execute(name: string, args: any, telegramId?: string){ if(name==='checkAvailability') return reservationService.checkAvailability(args.fecha,args.hora,args.cantidadPersonas); if(name==='createReservation') return reservationService.createReservation({...args, cliente:{...args.cliente, telegramId}}); if(name==='searchReservation') return reservationService.searchReservation(args); if(name==='getRestaurantRules') return reservationService.rules(); if(name==='getCurrentDate') return { now: new Date().toISOString() }; throw new Error(`Función no soportada: ${name}`); }
}
export const openAiAssistant = new OpenAiAssistant();
