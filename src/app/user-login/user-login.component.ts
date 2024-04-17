import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface User {
  username:string;
  password:string;
}

@Component({
  selector: 'user-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss'
})
export class UserLoginComponent {
constructor(private router: Router) {}

username!:string;
password!:string;

users: User[] = [];

ngOnInit() {
this.users = [
  { username: 'gurutong', password: 'kosongadalahisi' },
  { username: 'cupatkay', password: 'manispahitasmara' },
  { username:'shawuching', password:'tidakadasesuatupundiduniainiyangsulittetapiberpikirmembuatnyatampakbegitu'},
  { username: 'sungokong', password: 'gurujangankhawatir' }
];
}

doLogin() {
  const foundUser = this.users.find(user => user.username === this.username && user.password === this.password);
  if (foundUser) {
    this.router.navigate(['/project-list']);
  } else {
    alert('Wrong username or password');
  }
}



}
