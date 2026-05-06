import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableroService } from '../../services/tablero-service';
import { Tablero } from '../../models/tablero';
import { Columna } from '../../models/columna';
import { Tarea } from '../../models/tarea';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board implements OnInit {
  public tablero: Tablero | undefined;
  public columnas: Columna[] = [];

  // Variables Drag and Drop Nativo
  public draggedTask: Tarea | null = null;

  // Formulario de Columna
  public showAddColModal = false;
  public colNombre = '';
  public colColor = '#6366f1';

  // Formulario de Tarea
  public showAddTaskModal = false;
  public taskNombre = '';
  public taskDesc = '';
  public taskEstimacion: number | null = null;
  public taskUsuarioId: number | null = null;
  public userList: import('../../models/usuario').Usuario[] = [];

  constructor(
    private tableroService: TableroService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userList = this.tableroService.getUsuarios();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadBoard(Number(id));
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  loadBoard(id: number): void {
    this.tablero = this.tableroService.getTableroById(id);
    if (this.tablero) {
      this.refreshColumns(id);
    } else {
      this.router.navigate(['/']);
    }
  }

  refreshColumns(tableroId: number): void {
    this.columnas = this.tableroService.getColumnasByTableroId(tableroId);
  }

  getTareasColumna(columnaId: number): Tarea[] {
    return this.tableroService.getTareasColumna(columnaId);
  }

  crearColumna(): void {
    if (this.colNombre.trim().length >= 3 && this.tablero) {
      const result = this.tableroService.createColumna(this.tablero.id, this.colNombre, this.colColor);
      if (result) {
        this.refreshColumns(this.tablero.id);
        this.showAddColModal = false;
        this.colNombre = '';
      }
    } else {
      alert('El nombre de la columna debe tener al menos 3 caracteres.');
    }
  }

  eliminarColumna(id: number): void {
    if (confirm('¿Eliminar esta columna y todas sus tareas?')) {
      this.tableroService.deleteColumna(id);
      if (this.tablero) this.refreshColumns(this.tablero.id);
    }
  }

  abrirModalTarea(): void {
    // Ya no pedimos el ID de la columna aquí para asignarla forzosamente a la primera
    this.showAddTaskModal = true;
  }

  crearTarea(): void {
    // Comprobamos que existan columnas en el tablero
    if (this.columnas.length === 0) {
      alert('Debes crear al menos una columna primero.');
      return;
    }

    // Por defecto, se crea en la primera columna (Ej: "Por hacer")
    const primeraColumnaId = this.columnas[0].id;

    if (this.taskNombre.trim().length >= 3 && this.taskEstimacion && this.taskUsuarioId) {
      const usuario = this.userList.find(u => u.id === Number(this.taskUsuarioId));
      if (usuario) {
        this.tableroService.createTarea(primeraColumnaId, this.taskNombre, this.taskDesc, this.taskEstimacion, usuario);
        this.showAddTaskModal = false;
        this.taskNombre = '';
        this.taskDesc = '';
        this.taskEstimacion = null;
        this.taskUsuarioId = null;
      }
    } else {
      alert('Complete todos los campos de la tarea (Título min 3 car., Estimación, Usuario).');
    }
  }

  eliminarTarea(id: number): void {
    if (confirm('¿Eliminar esta tarea?')) {
      this.tableroService.deleteTarea(id);
    }
  }

  // --- HTML5 Drag and Drop Events Requeridos ---

  onDragStart(tarea: Tarea, event: DragEvent) {
    this.draggedTask = tarea;
    // Obligatorio por el API HTML5
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', tarea.id.toString());
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent) {
    // Obligatorio para permitir el Drop
    event.preventDefault();
  }

  onDrop(columnaId: number, event: DragEvent) {
    event.preventDefault();
    if (this.draggedTask) {
      this.tableroService.updateTareaColumna(this.draggedTask.id, columnaId);
      this.draggedTask = null; // Limpieza
    }
  }

  onDragEnd(event: DragEvent) {
    // "Libera" la tarea marcada como en movimiento
    this.draggedTask = null;
  }
}