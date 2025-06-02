import { Component } from '@angular/core';
import { Appointment } from '../model/appointment';
import { AppointmentService } from '../service/appointment.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-appointment-list',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css'
})
export class AppointmentListComponent {
 appointments: Appointment[] = [];
  errorMessage: string | null = null;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data.filter(appointment => appointment.id && appointment.id.trim() !== '');
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los turnos';
        console.error('Error fetching appointments:', err);
      }
    });
  }

  deleteAppointment(id: string): void {
    if (!id) {
      this.errorMessage = 'ID de turno inválido';
      return;
    }
    if (confirm('¿Estás seguro de eliminar este turno?')) {
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () => {
          this.loadAppointments();
          this.errorMessage = null;
        },
        error: (err) => {
          this.errorMessage = 'Error al eliminar el turno';
          console.error('Error deleting appointment:', err);
        }
      });
    }
  }
}
