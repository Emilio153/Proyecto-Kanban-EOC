import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { TableroService } from '../../services/tablero-service';
import { Tablero } from '../../models/tablero';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
    public tableros: Tablero[] = [];

    // Modal logic for creating board (could be duplicated or shared service)
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
    }

    refreshTableros(): void {
        this.tableros = this.tableroService.getTableros();
    }

    crearTablero(): void {
        if (this.nuevoNombre.trim().length < 3) {
            alert('El nombre del proyecto debe tener al menos 3 caracteres.');
            return;
        }
        const nuevo = this.tableroService.createTablero(this.nuevoNombre, this.nuevoDesc, this.nuevoColor);
        this.refreshTableros();
        this.showAddModal = false;
        this.nuevoNombre = '';
        this.nuevoDesc = '';
        this.router.navigate(['/board', nuevo.id]);
    }
}
