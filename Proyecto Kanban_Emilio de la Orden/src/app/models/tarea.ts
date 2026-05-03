import { Columna } from "./columna";
import { Usuario } from "./usuario";

export interface Tarea {
    id: number;
    nombre: string;
    descripcion: string;
    fecha_creacion: Date;
    estimacion: number;
    columna: Columna;
    usuario: Usuario;
}
