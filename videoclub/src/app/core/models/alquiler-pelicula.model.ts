// core/models/alquiler-pelicula.model.ts
export interface AlquilerPelicula {
  idAlquiler: number;        // PK, FK -> Alquiler
  idPelicula: number;        // PK, FK -> Pelicula
}
