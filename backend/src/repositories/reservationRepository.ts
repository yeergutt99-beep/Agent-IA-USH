import { Reservation, ReservationStatus } from '../models/domain.js';
import { FirestoreRepository } from './firestoreRepository.js';
export class ReservationRepository extends FirestoreRepository<Reservation> {
  constructor(){ super('reservations'); }
  async search(filters: { fecha?: string; estado?: ReservationStatus; customerId?: string }) {
    let query: FirebaseFirestore.Query = this.collection;
    if (filters.fecha) query = query.where('fecha', '==', filters.fecha);
    if (filters.estado) query = query.where('estado', '==', filters.estado);
    if (filters.customerId) query = query.where('customerId', '==', filters.customerId);
    const snap = await query.orderBy('hora', 'asc').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Reservation);
  }
  async findDuplicate(customerId: string, fecha: string, hora: string) {
    const snap = await this.collection.where('customerId','==',customerId).where('fecha','==',fecha).where('hora','==',hora).where('estado','in',['pending','confirmed']).limit(1).get();
    return snap.empty ? null : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as Reservation);
  }
}
