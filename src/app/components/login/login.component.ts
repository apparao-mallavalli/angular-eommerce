import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { Router } from '@angular/router';
//import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  public loginInvalid: boolean;
  private formSubmitAttempt: boolean;

  constructor(private fb: FormBuilder, private router: Router,
    private authService: AuthService, private previousRouteService: PreviousRouteService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      try {
        await this.authService.login(this.form.value);
        //this.router.navigateByUrl('/this.previousRouteService.getPreviousUrl');
      } catch (err) {
        console.log(err);
        this.loginInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }
}
//this.router.navigateByUrl('/products');