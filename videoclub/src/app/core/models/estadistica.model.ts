// core/models/estadistica.model.ts
export interface Estadistica {
  idEstadistica: number;     // PK
  socioId: number;           // FK -> Socio
  fechaCreacion: string;     // DateTime ISO, no editable
  totalGastado: number;      // derivado
  mes: number;               // 1..12
  anio: number;              // año (ej: 2025)
}
