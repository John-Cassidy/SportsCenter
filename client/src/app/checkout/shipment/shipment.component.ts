import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CoreComponent } from '../../core';
import { DeliveryOption } from '../../shared/models/DeliveryOption';
import { SharedComponent } from '../../shared';

@Component({
  selector: 'app-shipment',
  standalone: true,
  imports: [CoreComponent, SharedComponent],
  templateUrl: './shipment.component.html',
  styleUrl: './shipment.component.scss',
})
export class ShipmentComponent implements OnInit {
  @Input() deliveryOption: DeliveryOption | null = null;
  @Output() shippingOptionSubmitted = new EventEmitter<DeliveryOption>();

  shipmentForm: FormGroup;
  deliveryOptions: DeliveryOption[] = [
    {
      id: 1,
      name: 'Fedex',
      deliveryTime: '2 days',
      description: 'Fast delivery',
      price: 300,
    },
    {
      id: 2,
      name: 'DTDC',
      deliveryTime: '3 days',
      description: 'Reliable delivery',
      price: 200,
    },
    {
      id: 3,
      name: 'First Flight',
      deliveryTime: '4 days',
      description: 'Economical delivery',
      price: 150,
    },
    {
      id: 4,
      name: 'Normal',
      deliveryTime: '7 days',
      description: 'Standard delivery',
      price: 100,
    },
  ];

  constructor(private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {
    this.shipmentForm = this.formBuilder.group({
      selectedOption: [
        this.deliveryOption
          ? this.deliveryOption.id
          : this.deliveryOptions[0].id,
        Validators.required,
      ],
    });
  }

  ngOnInit(): void {
    if (!this.deliveryOption) {
      this.deliveryOption = this.deliveryOptions[0];
    }
    this.updateShipmentPrice();
    this.cd.detectChanges();
  }

  updateShipmentPrice(updateParent: boolean = false) {
    if (this.deliveryOption) {
      this.shipmentForm.patchValue({ selectedOption: this.deliveryOption.id });
    }

    if (updateParent && this.deliveryOption) {
      this.shippingOptionSubmitted.emit(this.deliveryOption);
    }
  }

  submitShippingOption(): void {
    if (this.shipmentForm.valid) {
      this.deliveryOption =
        this.deliveryOptions.find(
          (option) => option.id === this.shipmentForm.value.selectedOption
        ) || null;
      this.updateShipmentPrice(true);
    }
  }

  updateShippingOption(): void {
    if (this.shipmentForm.valid) {
      this.deliveryOption =
        this.deliveryOptions.find(
          (option) => option.id === this.shipmentForm.value.selectedOption
        ) || null;
    }
  }
}
