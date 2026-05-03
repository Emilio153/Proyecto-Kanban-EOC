import { Tablero } from "./tablero";

export interface Columna {
    id: number;
    nombre: string;
    color: string;
    tablero: Tablero;
}
