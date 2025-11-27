// core/models/alquiler.model.ts
export interface Alquiler {
  codigoAlquiler: number;    // PK
  socioId: number;           // FK -> Socio
  fechaRecogida: string;     // ISO
  fechaDevolucion: string;   // ISO
  totalPagar: number;        // derivado
}
