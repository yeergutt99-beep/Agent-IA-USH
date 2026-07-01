import { RestaurantTable } from '../models/domain.js';
import { FirestoreRepository } from './firestoreRepository.js';
export class TableRepository extends FirestoreRepository<RestaurantTable> { constructor(){ super('tables'); } }
