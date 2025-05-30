import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication';
import { Router } from '@angular/router'; 


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService, 
    private router: Router
  ) { }
  ngOnInit(): void { }
  public isLoggedIn(): boolean { 
    return this.authenticationService.isLoggedIn(); 
  }
  public onLogout(): void { 
    this.authenticationService.logout(); 
    this.router.navigateByUrl('#'); 
    return;
  }
}
