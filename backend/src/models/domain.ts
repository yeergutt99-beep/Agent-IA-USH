export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
export interface Customer { id: string; nombre: string; telefono: string; telegramId?: string; historialReservas: string[]; }
export interface Reservation { id: string; customerId: string; fecha: string; hora: string; cantidadPersonas: number; estado: ReservationStatus; mesaAsignada?: string; observaciones?: string; fechaCreacion: string; }
export interface RestaurantTable { id: string; numero: number; capacidad: number; disponible: boolean; }
export interface RestaurantConfig { id: 'main'; horarioApertura: string; horarioCierre: string; duracionReservaMinutos: number; maxPersonasPorMesa: number; reglasNegocio: string[]; }
