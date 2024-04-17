import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'project-list',
  standalone: true,
  imports: [],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent {
  constructor(private router: Router) {}

  gotoCBA() {
    // Redirect to 'project-list'
    this.router.navigate(['/cost-benefit']);
  }
}
