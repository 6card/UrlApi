import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
  // ...
} from '@angular/animations';

import { AuthenticationService } from '../../services/auth.service';

import { delay, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [
    trigger('error', [
      transition(':enter', [
        animate(
          '200ms',
          keyframes([
            style({transform: 'translateX(7%)', offset: 0}), 
            style({transform: 'translateX(-7%)', offset: 0.25}), 
            style({transform: 'translateX(3%)', offset: 0.5}), 
            style({transform: 'translateX(-3%)', offset: 1}),
          ])
        ),
      ]),
      /*
      transition(':enter', [          
        style({transform: 'translateX(5%)'}),    
        animate('0.1s ease-in-out', style({transform: 'translateX(-5%)'}))
      ]),
      */
      /*
      transition(':enter', [
        animate(
          '600ms',
          keyframes([
            style({ transform: 'scale(0,0)', offset: 0 }),
            style({ opacity: 1, offset: 0.2 }),
            style({ transform: 'scale(1.2,1.2)', offset: 0.4 }),
            style({ transform: 'scale(.9,.9)', offset: 0.6 }),
            style({ transform: 'scale(1,1)', offset: 1 }),
          ])
        ),
      ]),
      
      transition(':leave', [          
        style({transform: 'translateX(-5%)'}),    
        animate('0.1s ease-in-out', style({transform: 'translateX(100%)'}))
      ])
      */
    ])
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  //returnUrl: string;
  loginError: boolean = false;
  submitLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    this.authenticationService.logout();

    
  }

  onSubmit() {
    this.submitLoading = true;  
    this.loginError = false;  

    if (this.loginForm.invalid) {
        return;
    }

    this.authenticationService.login(this.loginForm.controls.username.value, this.loginForm.controls.password.value)
      .pipe(
        delay(1000),
        finalize( () => this.submitLoading = false)
      )
        .subscribe(
            data => {
              this.loginError = !data;
              if (data) {
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                this.router.navigateByUrl(returnUrl);
              }
            });
}

}
