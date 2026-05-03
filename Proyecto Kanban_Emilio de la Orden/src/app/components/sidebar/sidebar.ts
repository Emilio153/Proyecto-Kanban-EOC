import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { TableroService } from '../../services/tablero-service';
import { Tablero } from '../../models/tablero';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterModule, FormsModule],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
    public tableros: Tablero[] = [];

    // Board form (Modal logic can be here or shared)
    public showAddModal = false;
    public nuevoNombre = '';
    public nuevoDesc = '';
    public nuevoColor = '#3b82f6';

    constructor(
        private tableroService: TableroService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.refreshTableros();
        // Subscribe to router events or service changes if needed to update active state
        // For now, simpler approach: rely on routerLinkActive
    }

    refreshTableros(): void {
        this.tableros = this.tableroService.getTableros();
    }

    crearTablero(): void {
        if (this.nuevoNombre.trim().length < 3) {
            alert('El nombre del proyecto debe tener al menos 3 caracteres.');
            return;
        }

        // Generate secure ID (Simple approach until Service update)
        const nuevo = this.tableroService.createTablero(this.nuevoNombre, this.nuevoDesc, this.nuevoColor);
        this.refreshTableros();
        this.showAddModal = false;
        this.nuevoNombre = '';
        this.nuevoDesc = '';
        this.router.navigate(['/board', nuevo.id]);
    }

    eliminarTablero(id: number, event: Event): void {
        event.stopPropagation();
        event.preventDefault(); // Prevent navigation
        if (confirm('¿Estas seguro de que quieres eliminar este tablero? Todos sus datos se perderán.')) {
            this.tableroService.deleteTablero(id);
            this.refreshTableros();
            // If we are on this board, go home
            if (this.router.url.includes(`/board/${id}`)) {
                this.router.navigate(['/']);
            }
        }
    }
}
