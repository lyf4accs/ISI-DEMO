// core/models/pelicula.model.ts
export interface Pelicula {
  codigoPelicula: number;    // PK
  videoclubId: number;       // FK -> Videoclub
  nombre: string;
  director?: string | null;
  fechaDeEstreno: string;    // ISO string (Date)
  precioAlquiler: number;
}
