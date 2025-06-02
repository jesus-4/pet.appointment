import { Component } from '@angular/core';
import { Appointment } from '../model/appointment';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../service/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css'
})
export class AppointmentFormComponent {
  appointmentForm: FormGroup;
  editMode: boolean = false;
  appointmentId: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      petName: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z\\s]+$'),
        Validators.maxLength(50)
      ]],
      ownerName: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z\\s]+$'),
        Validators.maxLength(100)
      ]],
      date: ['', [
        Validators.required,
        this.minDateValidator()
      ]],
      time: ['', [
        Validators.required,
        this.timeRangeValidator()
      ]],
      reason: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)
      ]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        if (!id.trim()) {
          this.errorMessage = 'ID de turno inválido';
          this.router.navigate(['/list']);
          return;
        }
        this.editMode = true;
        this.appointmentId = id;
        this.appointmentService.getAppointment(this.appointmentId!).subscribe({
          next: (appointment) => {
            this.appointmentForm.patchValue(appointment);
            this.errorMessage = null;
          },
          error: (err) => {
            this.errorMessage = 'No se pudo cargar el turno';
            console.error('Error fetching appointment:', err);
            this.router.navigate(['/list']);
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const appointment: Appointment = this.appointmentForm.value;
      if (this.editMode && this.appointmentId) {
        appointment.id = this.appointmentId;
        this.appointmentService.updateAppointment(appointment).subscribe({
          next: () => {
            this.router.navigate(['/list']);
            this.errorMessage = null;
          },
          error: (err) => {
            this.errorMessage = 'Error al actualizar el turno';
            console.error('Error updating appointment:', err);
          }
        });
      } else {
        this.appointmentService.createAppointment(appointment).subscribe(
          {
            next: () => {
              this.router.navigate(['/list']);
            }
          }
        )
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/list']);
  }

  private minDateValidator() {
    return (control: any) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(control.value);
      return inputDate >= today ? null : { minDate: true };
    };
  }

  private timeRangeValidator() {
    return (control: any) => {
      const time = control.value;
      if (!time) return null;
      const [hours, minutes] = time.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      const minTime = 8 * 60; // 08:00
      const maxTime = 18 * 60; // 18:00
      return totalMinutes >= minTime && totalMinutes <= maxTime ? null : { timeRange: true };
    };
  }
}
