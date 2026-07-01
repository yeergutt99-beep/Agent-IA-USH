import { RestaurantConfig } from '../models/domain.js';
import { FirestoreRepository } from './firestoreRepository.js';
export class RestaurantRepository extends FirestoreRepository<RestaurantConfig> { constructor(){ super('restaurant'); } async getConfig(){ return (await this.getById('main')) ?? { id:'main', horarioApertura:'12:00', horarioCierre:'23:00', duracionReservaMinutos:120, maxPersonasPorMesa:8, reglasNegocio:['Verificar disponibilidad antes de crear reservas','No duplicar reservas activas por cliente y horario'] }; } }
