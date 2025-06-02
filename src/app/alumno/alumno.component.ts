import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-alumno',
  imports: [CommonModule],
  templateUrl: './alumno.component.html',
  styleUrl: './alumno.component.css'
})
export class AlumnoComponent {
  public nombres: string = 'Amadeo Jesus';
  public apellido: string = 'Claramonte';
  public dni : string = '43635654';
  public fechaActual: Date = new Date("02/06/2025");
}
