import { Injectable } from '@angular/core';
import { Tablero } from '../models/tablero';
import { Columna } from '../models/columna';
import { Tarea } from '../models/tarea';
import { Usuario } from '../models/usuario';

export const COLORS = {
  trabajo: '#0d9488',
  pendientes: '#f90303ff',
  progreso: '#f58207ff',
  completadas: '#0bc011ff'
};

@Injectable({
  providedIn: 'root',
})
export class TableroService {
  private _tableros: Tablero[] = [];
  private _columnas: Columna[] = [];
  private _tareas: Tarea[] = [];
  private _usuarios: Usuario[] = [];

  constructor() {
    this.loadFromStorage();
    if (this._tableros.length === 0) {
      this.initData();
      this.saveToStorage();
    }
  }

  generateId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  private nextUsuarioId(): number {
    if (this._usuarios.length === 0) return 1;
    return Math.max(...this._usuarios.map(u => u.id)) + 1;
  }

  private initData(): void {
    const tablero1: Tablero = { id: 1, nombre: 'Desarrollo Web', descripcion: 'Tareas del proyecto frontend', fondo: COLORS.trabajo };
    this._tableros = [tablero1];

    const col1: Columna = { id: 11, nombre: 'Por Hacer',  color: COLORS.pendientes,  tablero: tablero1 };
    const col2: Columna = { id: 12, nombre: 'En Proceso', color: COLORS.progreso,     tablero: tablero1 };
    const col3: Columna = { id: 13, nombre: 'Realizado',  color: COLORS.completadas,  tablero: tablero1 };
    this._columnas = [col1, col2, col3];

    this._usuarios = [
      { id: 1, nombre: 'Laura',   apellido: 'Sánchez', email: 'laura@taskflow.com'   },
      { id: 2, nombre: 'David',   apellido: 'Romero',  email: 'david@taskflow.com'   },
      { id: 3, nombre: 'Sofía',   apellido: 'Navarro', email: 'sofia@taskflow.com'   },
      { id: 4, nombre: 'Marcos',  apellido: 'Gil',     email: 'marcos@taskflow.com'  },
      { id: 5, nombre: 'Beatriz', apellido: 'Herrera', email: 'beatriz@taskflow.com' },
    ];

    const u1 = this._usuarios[0];
    const u2 = this._usuarios[1];

    this._tareas = [
      { id: 101, nombre: 'Maquetación responsive',   descripcion: 'Adaptar la vista a dispositivos móviles',    fecha_creacion: new Date(), estimacion: 4, columna: col1, usuario: u1 },
      { id: 102, nombre: 'Integración con la API',   descripcion: 'Conectar los endpoints REST al servicio',    fecha_creacion: new Date(), estimacion: 6, columna: col1, usuario: u2 },
      { id: 103, nombre: 'Componente de login',       descripcion: 'Formulario de autenticación con validaciones', fecha_creacion: new Date(), estimacion: 3, columna: col2, usuario: u1 },
      { id: 104, nombre: 'Configuración del router',  descripcion: 'Definir rutas y guards de navegación',      fecha_creacion: new Date(), estimacion: 2, columna: col3, usuario: u2 },
      { id: 105, nombre: 'Instalación del proyecto',  descripcion: 'Inicializar Angular y dependencias base',   fecha_creacion: new Date(), estimacion: 1, columna: col3, usuario: u1 },
    ];
  }

  private saveToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('kanban_tableros', JSON.stringify(this._tableros));
      localStorage.setItem('kanban_columnas', JSON.stringify(this._columnas));
      localStorage.setItem('kanban_tareas',   JSON.stringify(this._tareas));
      localStorage.setItem('kanban_usuarios', JSON.stringify(this._usuarios));
    }
  }

  private loadFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const t   = localStorage.getItem('kanban_tableros');
      const c   = localStorage.getItem('kanban_columnas');
      const tar = localStorage.getItem('kanban_tareas');
      const u   = localStorage.getItem('kanban_usuarios');

      if (t)   this._tableros  = JSON.parse(t);
      if (c)   this._columnas  = JSON.parse(c);
      if (tar) this._tareas    = JSON.parse(tar);
      if (u)   this._usuarios  = JSON.parse(u);
    }
  }

  // --- Tableros ---

  getTableros(): Tablero[] { return this._tableros; }

  getTableroById(id: number): Tablero | undefined {
    return this._tableros.find(t => t.id === id);
  }

  createTablero(nombre: string, descripcion: string, color: string): Tablero {
    const nuevo: Tablero = { id: this.generateId(), nombre, descripcion, fondo: color };
    this._tableros.push(nuevo);
    this.createColumna(nuevo.id, 'Por Hacer', COLORS.pendientes);
    this.createColumna(nuevo.id, 'En Proceso', COLORS.progreso);
    this.createColumna(nuevo.id, 'Realizado',  COLORS.completadas);
    this.saveToStorage();
    return nuevo;
  }

  deleteTablero(id: number): void {
    this._tableros = this._tableros.filter(t => t.id !== id);
    this._columnas = this._columnas.filter(c => c.tablero.id !== id);
    this._tareas   = this._tareas.filter(tar => this._columnas.some(c => c.id === tar.columna.id));
    this.saveToStorage();
  }

  // --- Columnas ---

  getColumnasByTableroId(tableroId: number): Columna[] {
    return this._columnas.filter(c => c.tablero.id === tableroId);
  }

  createColumna(tableroId: number, nombre: string, color: string): Columna | undefined {
    const tablero = this.getTableroById(tableroId);
    if (!tablero) return undefined;
    if (this.getColumnasByTableroId(tableroId).length >= 5) {
      alert('El límite de columnas por tablero es 5.');
      return undefined;
    }
    const nueva: Columna = { id: this.generateId(), nombre, color, tablero };
    this._columnas.push(nueva);
    this.saveToStorage();
    return nueva;
  }

  deleteColumna(id: number): void {
    this._columnas = this._columnas.filter(c => c.id !== id);
    this._tareas   = this._tareas.filter(t => t.columna.id !== id);
    this.saveToStorage();
  }

  // --- Tareas ---

  getTareasColumna(columnaId: number): Tarea[] {
    return this._tareas.filter(tarea => tarea.columna.id === columnaId);
  }

  createTarea(columnaId: number, nombre: string, descripcion: string, estimacion: number, usuario: Usuario): Tarea | undefined {
    const columna = this._columnas.find(c => c.id === columnaId);
    if (!columna) return undefined;
    const nueva: Tarea = { id: this.generateId(), nombre, descripcion, fecha_creacion: new Date(), estimacion, columna, usuario };
    this._tareas.push(nueva);
    this.saveToStorage();
    return nueva;
  }

  deleteTarea(id: number): void {
    this._tareas = this._tareas.filter(t => t.id !== id);
    this.saveToStorage();
  }

  updateTareaColumna(tareaId: number, newColId: number): void {
    const tarea = this._tareas.find(t => t.id === tareaId);
    if (tarea) {
      const newCol = this._columnas.find(c => c.id === newColId);
      if (newCol) { tarea.columna = newCol; this.saveToStorage(); }
    }
  }

  // --- Usuarios ---

  getUsuarios(): Usuario[] { return this._usuarios; }

  createUsuario(nombre: string, apellido: string, email: string): Usuario | undefined {
    const emailNorm = email.trim().toLowerCase();
    if (this._usuarios.some(u => u.email.toLowerCase() === emailNorm)) {
      alert('Ya existe un usuario con ese email.');
      return undefined;
    }
    const nuevo: Usuario = { id: this.nextUsuarioId(), nombre: nombre.trim(), apellido: apellido.trim(), email: emailNorm };
    this._usuarios.push(nuevo);
    this.saveToStorage();
    return nuevo;
  }

  updateUsuario(id: number, nombre: string, apellido: string, email: string): boolean {
    const emailNorm = email.trim().toLowerCase();
    // Validar que el email no exista en OTRO usuario distinto al que estamos editando
    if (this._usuarios.some(u => u.email.toLowerCase() === emailNorm && u.id !== id)) {
      alert('Ya existe otro usuario con ese email.');
      return false;
    }

    const index = this._usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      this._usuarios[index].nombre = nombre.trim();
      this._usuarios[index].apellido = apellido.trim();
      this._usuarios[index].email = emailNorm;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  deleteUsuario(id: number): void {
    this._usuarios = this._usuarios.filter(u => u.id !== id);
    this.saveToStorage();
  }
}