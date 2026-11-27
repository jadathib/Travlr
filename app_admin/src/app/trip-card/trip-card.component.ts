import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Trip } from '../models/trip';
import { AuthenticationService } from '../authentication';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.css']
})
export class TripCardComponent implements OnInit {

  @Input('trip') trip: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
  }
  public isAdmin(): boolean{
    return this.authenticationService.isAdmin();
  }

  public editTrip(trip: Trip): void {
    console.log('Inside TripListingComponent#editTrip');
    localStorage.setItem("tripId", trip._id);
    this.router.navigate(['edit-trip']);
  }
}
