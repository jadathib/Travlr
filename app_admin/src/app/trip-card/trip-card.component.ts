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

  public get thumbnailUrl(): string | null {
    const image = this.trip.images?.[0] || this.trip.image;
    if (!image) return null;

    // Seeded trips use public-site paths, while Angular bundles the same images under assets.
    if (image.startsWith('/images/') || image.startsWith('images/')) {
      return `assets/${image.replace(/^\//, '')}`;
    }
    return image.includes('/') || image.includes(':') ? image : `assets/images/${image}`;
  }

  public editTrip(trip: Trip): void {
    console.log('Inside TripListingComponent#editTrip');
    localStorage.setItem("tripId", trip._id);
    this.router.navigate(['edit-trip']);
  }
}
