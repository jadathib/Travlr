import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-edit-trip',
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css']
})
export class EditTripComponent implements OnInit {

  editForm!: FormGroup;
  submitted = false;
  formError = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripDataService
  ) { }

  ngOnInit() {
    // retrieve stashed tripId
    const tripId = localStorage.getItem("tripId");
    if (!tripId) {
      alert ("Select a trip from the trip list.");
      this.router.navigate(['']);
      return;
    }

    //initialize form
    this.editForm = this.formBuilder.group({
      _id: [],
      code: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: [''],
      image: [''],
      description: ['', Validators.required],
    })

    this.tripService.getTrip(tripId)
      .then(data => {
        console.log(data);
        // Don't use editForm.setValue() as it will throw
        this.editForm.patchValue({
          ...data,
          code: data.code ?? '',
          length: data.duration ?? data.length?.match(/^\d+/)?.[0] ?? '',
          start: data.startDate ?? data.start ?? '',
          resort: data.destination ?? data.resort?? '',
          perPerson: data.price ?? data.perPerson?? '',
          image: data.images?.[0] ?? data.image?? ''
        });
      })
      .catch(error => { this.formError = String(error); });
  }

  onSubmit() {
    this.submitted = true;
    this.formError = '';

    if (this.editForm.valid && this.editForm.value._id) {
      const datesChanged = this.f.start.dirty || this.f.length.dirty;
      this.tripService.updateTrip(this.editForm.value, datesChanged)
        .then((data: any) => {
          console.log(data);
          this.router.navigate(['/list-trips']);
        })
        .catch(error => { this.formError = String(error); });
    }
  }

  // get the form short name to access the form fields
  get f() { return this.editForm.controls; }

}
