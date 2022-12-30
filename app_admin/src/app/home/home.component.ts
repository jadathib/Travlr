import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  public isLoggedIn(): boolean { 
    return this.authService.isLoggedIn();
  }
}
