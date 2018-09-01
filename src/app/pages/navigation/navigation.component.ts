import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit{
  //reportsUrl: any;
  //isLoggedIn : boolean = false;

  constructor(
    public authService:AuthenticationService,
  ){

  }

  ngOnInit(){

  }
}