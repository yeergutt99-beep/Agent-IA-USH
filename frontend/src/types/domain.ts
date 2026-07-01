export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
export interface Reservation { id:string; customerId:string; fecha:string; hora:string; cantidadPersonas:number; estado:ReservationStatus; mesaAsignada?:string; observaciones?:string; fechaCreacion:string; }
export interface RestaurantTable { id:string; numero:number; capacidad:number; disponible:boolean; }
