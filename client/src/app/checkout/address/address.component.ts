import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Address } from '../../shared/models/Address';
import { CoreComponent } from '../../core';
import { SharedComponent } from '../../shared';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CoreComponent, SharedComponent],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
})
export class AddressComponent implements OnInit {
  @Input() shippingAddress: Address; // New Input property
  @Output() addressSubmitted = new EventEmitter<Address>();
  addressForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.shippingAddress = {
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
    };

    this.addressForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    });
  }

  ngOnInit(): void {
    // Update form values with shippingAddress values
    if (this.shippingAddress) {
      this.addressForm.patchValue(this.shippingAddress);
    }
  }

  submitAddress(): void {
    if (this.addressForm.valid) {
      this.addressSubmitted.emit(this.addressForm.value);
    }
  }
}
