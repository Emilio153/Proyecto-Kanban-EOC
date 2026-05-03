import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableroService } from '../../services/tablero-service';
import { Tablero } from '../../models/tablero';
import { Columna } from '../../models/columna';
import { Tarea } from '../../models/tarea';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board implements OnInit {
  public tablero: Tablero | undefined;
  public columnas: Columna[] = [];

  // Column form
  public showAddColModal = false;
  public colNombre = '';
  public colColor = '#6366f1';

  // Task form
  public showAddTaskModal = false;
  public taskNombre = '';
  public taskDesc = '';
  public taskEstimacion: number | null = null;
  public taskUsuarioId: number | null = null;
  public userList: import('../../models/usuario').Usuario[] = [];
  public selectedColId: number | null = null;

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

  abrirModalTarea(columnaId: number): void {
    this.selectedColId = columnaId;
    this.showAddTaskModal = true;
  }

  crearTarea(): void {
    if (this.taskNombre.trim().length >= 3 && this.selectedColId && this.taskEstimacion && this.taskUsuarioId) {
      const usuario = this.userList.find(u => u.id === Number(this.taskUsuarioId));
      if (usuario) {
        this.tableroService.createTarea(this.selectedColId, this.taskNombre, this.taskDesc, this.taskEstimacion, usuario);
        this.showAddTaskModal = false;
        this.taskNombre = '';
        this.taskDesc = '';
        this.taskEstimacion = null;
        this.taskUsuarioId = null;
        this.selectedColId = null;
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

  drop(event: CdkDragDrop<Tarea[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const task = event.container.data[event.currentIndex];
      const newColId = Number(event.container.id);
      if (!isNaN(newColId)) {
        this.tableroService.updateTareaColumna(task.id, newColId);
      }
    }
  }
}
