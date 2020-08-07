import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ServerService } from './server.service';
import { PreviousRouteService } from './previous-route.service';

@Injectable()
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private token: string;

  email: string;

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router, private server: ServerService,
    private previousRouteService: PreviousRouteService) 
    {
    console.log('Auth Service');
    const userData = localStorage.getItem('user');
    if (userData) {
      console.log('Logged in from memory');
      const user = JSON.parse(userData);
      this.token = user.token;
      this.server.setLoggedIn(true, this.token);
      this.loggedIn.next(true);
    }
  }

  login(user) {
    if (user.email !== '' && user.password !== '') {
      return this.server.request('POST', '/login', {
        username: user.email,
        password: user.password
      }).subscribe((response: any) => {
        if (response !== undefined) {
          console.log(response);
          this.email = user.email;
          this.token = response.token;
          this.server.setLoggedIn(true, this.token);
          this.loggedIn.next(true);
          const userData = {
            token: this.token,
          };
          localStorage.setItem('user', JSON.stringify(userData));
          //console.log(this.previousRouteService.getPreviousUrl());
          this.router.navigateByUrl(this.previousRouteService.getPreviousUrl());
        }
        else {
          this.email = user.email;
        }
      });
    }
  }

  logout() {


    this.server.setLoggedIn(false);
    delete this.token;

    this.loggedIn.next(false);
    //localStorage.removeItem('user');
    localStorage.clear();
    this.router.navigate(['/products']);



  }
  getEmail() {
    return this.email;
  }
}