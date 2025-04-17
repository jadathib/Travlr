import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { observable } from 'rxjs';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css']
})
export class AddTripComponent implements OnInit {

  addForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripDataService
  ) { }

  ngOnInit(): void {
    // Date pattern: YYYY-MM-DD
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    // Price pattern: positive number with up to 2 decimal places
    const pricePattern = /^\d+(\.\d{1,2})?$/;

    this.addForm = this.formBuilder.group({
      _id: [],
      code: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10)
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      length: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(30),
        Validators.pattern(/^[0-9]+$/)
      ]],
      start: ['', [
        Validators.required,
        Validators.pattern(datePattern)
      ]],
      resort: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      perPerson: ['', [
        Validators.required,
        Validators.min(0),
        Validators.pattern(pricePattern)
      ]],
      image: ['', [
        Validators.required,
        Validators.pattern(/^https?:\/\/.+/)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(2000)
      ]],
    }, {
      validators: [this.dateValidator]
    })
  }

  // Custom validator to ensure start date is not in the past
  dateValidator(formGroup: FormGroup) {
    const startControl = formGroup.get('start');

    if (!startControl || !startControl.value) {
      return null;
    }

    const startDate = new Date(startControl.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      startControl.setErrors({ ...startControl.errors, pastDate: true });
      return { pastDate: true };
    }

    return null;
  }

  onSubmit() {
    this.submitted = true;
    if(this.addForm.valid){
      this.tripService.addTrip(this.addForm.value )
      .then( data => {
        console.log(data);
        this.router.navigate(['']);
      });
    }
  }

  // get the form short name to access the form fields
  get f() { return this.addForm.controls; }

}
