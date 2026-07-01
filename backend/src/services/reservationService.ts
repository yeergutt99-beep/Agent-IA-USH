import crypto from 'node:crypto';
import { z } from 'zod';
import { Customer, Reservation, ReservationStatus } from '../models/domain.js';
import { CustomerRepository } from '../repositories/customerRepository.js';
import { ReservationRepository } from '../repositories/reservationRepository.js';
import { RestaurantRepository } from '../repositories/restaurantRepository.js';
import { TableRepository } from '../repositories/tableRepository.js';
import { logger } from '../utils/logger.js';
const reservationInput = z.object({ cliente: z.object({ nombre: z.string().min(2), telefono: z.string().min(5), telegramId: z.string().optional() }), fecha: z.string(), hora: z.string(), cantidadPersonas: z.number().int().positive(), observaciones: z.string().optional() });
export class ReservationService {
  constructor(private reservations=new ReservationRepository(), private customers=new CustomerRepository(), private tables=new TableRepository(), private restaurant=new RestaurantRepository()){}
  async checkAvailability(fecha: string, hora: string, cantidadPersonas: number){
    const config = await this.restaurant.getConfig();
    if (hora < config.horarioApertura || hora > config.horarioCierre) return { disponibilidad:false, mesasPosibles:[], motivo:'Fuera del horario del restaurante' };
    const [tables, booked] = await Promise.all([this.tables.getAll(), this.reservations.search({ fecha })]);
    const occupied = new Set(booked.filter(r => r.hora === hora && ['pending','confirmed'].includes(r.estado)).map(r => r.mesaAsignada).filter(Boolean));
    const mesasPosibles = tables.filter(t => t.disponible && t.capacidad >= cantidadPersonas && !occupied.has(t.id));
    return { disponibilidad: mesasPosibles.length > 0, mesasPosibles };
  }
  async createReservation(raw: unknown): Promise<Reservation>{
    const input = reservationInput.parse(raw);
    const availability = await this.checkAvailability(input.fecha, input.hora, input.cantidadPersonas);
    if (!availability.disponibilidad) throw new Error('No existe disponibilidad para el horario solicitado');
    let customer = await this.customers.findByPhone(input.cliente.telefono);
    if (!customer) customer = await this.customers.upsert({ id: crypto.randomUUID(), nombre: input.cliente.nombre, telefono: input.cliente.telefono, telegramId: input.cliente.telegramId, historialReservas: [] });
    const duplicate = await this.reservations.findDuplicate(customer.id, input.fecha, input.hora);
    if (duplicate) throw new Error('Ya existe una reserva activa para este cliente en ese horario');
    const reservation: Reservation = { id: crypto.randomUUID(), customerId: customer.id, fecha: input.fecha, hora: input.hora, cantidadPersonas: input.cantidadPersonas, estado:'confirmed', mesaAsignada: availability.mesasPosibles[0].id, observaciones: input.observaciones, fechaCreacion: new Date().toISOString() };
    await this.reservations.upsert(reservation); await this.customers.upsert({ ...customer, historialReservas:[...new Set([...customer.historialReservas, reservation.id])] });
    logger.info({ reservationId: reservation.id }, 'reservation_created'); return reservation;
  }
  async updateReservation(id: string, patch: Partial<Reservation>){ const current=await this.reservations.getById(id); if(!current) throw new Error('Reserva no encontrada'); const next={...current,...patch,id}; await this.reservations.upsert(next); logger.info({id},'reservation_updated'); return next; }
  async cancelReservation(id: string){ return this.updateReservation(id,{estado:'cancelled'}); }
  async deleteReservation(id: string){ await this.reservations.delete(id); logger.info({id},'reservation_deleted'); }
  async searchReservation(filters: { fecha?: string; estado?: ReservationStatus; customerId?: string }){ return this.reservations.search(filters); }
  async dashboard(){ const [reservations,tables,customers]=await Promise.all([this.reservations.getAll(),this.tables.getAll(),this.customers.getAll()]); return { reservations, tables, customers, dailyOccupancy: reservations.filter(r=>r.estado==='confirmed').length }; }
  async rules(){ return this.restaurant.getConfig(); }
}
export const reservationService = new ReservationService();
