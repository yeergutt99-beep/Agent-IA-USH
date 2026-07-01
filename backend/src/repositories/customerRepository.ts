import { Customer } from '../models/domain.js';
import { FirestoreRepository } from './firestoreRepository.js';
export class CustomerRepository extends FirestoreRepository<Customer> {
  constructor(){ super('customers'); }
  async findByPhone(telefono: string){ const s=await this.collection.where('telefono','==',telefono).limit(1).get(); return s.empty?null:({id:s.docs[0].id,...s.docs[0].data()} as Customer); }
  async findByTelegramId(telegramId: string){ const s=await this.collection.where('telegramId','==',telegramId).limit(1).get(); return s.empty?null:({id:s.docs[0].id,...s.docs[0].data()} as Customer); }
}
