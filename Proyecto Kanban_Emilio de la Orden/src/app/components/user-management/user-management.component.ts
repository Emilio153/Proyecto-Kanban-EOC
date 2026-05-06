import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableroService } from '../../services/tablero-service';
import { Usuario } from '../../models/usuario';

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './user-management.component.html',
    styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
    usuarios: Usuario[] = [];

    // Formulario
    nuevoNombre: string = '';
    nuevoApellido: string = '';
    nuevoEmail: string = '';
    usuarioEditandoId: number | null = null; // Controla si estamos en edición

    constructor(private tableroService: TableroService) {
        this.refreshUsuarios();
    }

    refreshUsuarios() {
        this.usuarios = this.tableroService.getUsuarios();
    }

    guardarUsuario(event: Event) {
        event.preventDefault();

        if (!this.nuevoNombre || !this.nuevoApellido || !this.nuevoEmail) {
            alert('Por favor completa todos los campos.');
            return;
        }

        if (this.usuarioEditandoId) {
            // Modo Edición
            const result = this.tableroService.updateUsuario(
                this.usuarioEditandoId,
                this.nuevoNombre,
                this.nuevoApellido,
                this.nuevoEmail
            );
            if (result) {
                this.refreshUsuarios();
                this.resetForm();
            }
        } else {
            // Modo Creación
            const result = this.tableroService.createUsuario(
                this.nuevoNombre,
                this.nuevoApellido,
                this.nuevoEmail
            );
            if (result) {
                this.refreshUsuarios();
                this.resetForm();
            }
        }
    }

    editarUsuario(user: Usuario) {
        this.usuarioEditandoId = user.id;
        this.nuevoNombre = user.nombre;
        this.nuevoApellido = user.apellido;
        this.nuevoEmail = user.email;
    }

    eliminarUsuario(id: number) {
        if (confirm('¿Seguro que desea eliminar este usuario?')) {
            this.tableroService.deleteUsuario(id);
            this.refreshUsuarios();
            // Si estaba editando al usuario que borró, limpiamos el formulario
            if (this.usuarioEditandoId === id) {
                this.resetForm();
            }
        }
    }

    resetForm() {
        this.usuarioEditandoId = null;
        this.nuevoNombre = '';
        this.nuevoApellido = '';
        this.nuevoEmail = '';
    }
}