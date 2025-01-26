import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthResponse } from '../models/authresponse';
import { BROWSER_STORAGE } from '../storage';
import { Trip } from '../models/trip';
import { User } from '../models/user';

@Injectable()
export class TripDataService {

  private apiBaseUrl = 'http://localhost:3000/api';
  private tripUrl = `${this.apiBaseUrl}/trips/`; // Added trailing slash

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) { }

  // Add a new trip
  public addTrip(formData: Trip): Promise<Trip> {
    console.log('Inside TripDataService#addTrip');
    return this.http
      .post<Trip>(this.tripUrl, formData) // Ensure response is of type Trip
      .toPromise()
      .catch(this.handleError);
  }

  // Get a specific trip by its code
  public getTrip(tripCode: string): Promise<Trip> {
    console.log('Inside TripDataService#getTrip(tripCode)');
    return this.http
      .get<Trip>(`${this.tripUrl}${tripCode}`) // Ensure response is of type Trip
      .toPromise()
      .catch(this.handleError);
  }

  // Get all trips
  public getTrips(): Promise<Trip[]> {
    console.log('Inside TripDataService#getTrips');
    return this.http
      .get<Trip[]>(this.tripUrl) // Ensure response is an array of Trip
      .toPromise()
      .catch(this.handleError);
  }

  // Update an existing trip
  public updateTrip(formData: Trip): Promise<Trip> {
    console.log('Inside TripDataService#updateTrip');
    console.log(formData);
    return this.http
      .put<Trip>(`${this.tripUrl}${formData.code}`, formData) // Ensure response is of type Trip
      .toPromise()
      .catch(this.handleError);
  }

  // Error handling for HTTP requests
  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error); // For demo purposes only
    return Promise.reject(error.message || error);
  }

  // Login method
  public login(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('login', user);
  }

  // Register method (fixed URL path)
  public register(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('register', user); // Changed 'login' to 'register'
  }

  // Helper method for API calls related to authentication
  private makeAuthApiCall(urlPath: string, user: User): Promise<AuthResponse> {
    const url: string = `${this.apiBaseUrl}/${urlPath}`;
    return this.http
      .post<AuthResponse>(url, user) // Ensure response is of type AuthResponse
      .toPromise()
      .catch(this.handleError);
  }
}
