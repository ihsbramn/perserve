import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'www';

  constructor(private router: Router) {
    this.isLogin = this.router.url === '/luser-login' || this.router.url === '/';   
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLogin = event.url === '/user-login' || this.router.url === '/';
      }
    });
  }

  isLogin: boolean = true;

  ngOnInit() {
  
  }

  checkIsLogin(){
    return this.router.url === '/user-login' || this.router.url === '/';
  }


}
