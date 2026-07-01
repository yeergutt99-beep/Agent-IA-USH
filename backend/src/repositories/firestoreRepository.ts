import { CollectionReference, DocumentData } from 'firebase-admin/firestore';
import { db } from '../config/firebase.js';
export class FirestoreRepository<T extends { id: string }> {
  protected collection: CollectionReference<DocumentData>;
  constructor(name: string) { this.collection = db.collection(name); }
  async getAll(): Promise<T[]> { const snap = await this.collection.get(); return snap.docs.map(d => ({ id: d.id, ...d.data() }) as T); }
  async getById(id: string): Promise<T | null> { const doc = await this.collection.doc(id).get(); return doc.exists ? ({ id: doc.id, ...doc.data() } as T) : null; }
  async upsert(entity: T): Promise<T> { await this.collection.doc(entity.id).set(entity, { merge: true }); return entity; }
  async delete(id: string): Promise<void> { await this.collection.doc(id).delete(); }
}
