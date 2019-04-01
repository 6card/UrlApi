import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  template: ''
})

export class AuthComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.authenticationService.logout();
      //console.log(routeParams.sessionId, routeParams.username);
      this.auth(routeParams.username, routeParams.sessionId);
    });
  }


  public auth (username: string, sessionId: string) {

    this.authenticationService.checkAccess(username, sessionId)
      .subscribe(
          data => {
            if (data === true) {
              const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
              this.router.navigateByUrl(returnUrl);
            }
            else {
              this.router.navigate(['login']);
            }
          });
}

}
