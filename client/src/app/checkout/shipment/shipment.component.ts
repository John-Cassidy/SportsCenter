import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-shipment',
  standalone: true,
  imports: [],
  templateUrl: './shipment.component.html',
  styleUrl: './shipment.component.scss',
})
export class ShipmentComponent implements OnInit {
  shipmentForm: FormGroup;
  deliveryOptions = [
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

  constructor(private formBuilder: FormBuilder) {
    this.shipmentForm = this.formBuilder.group({
      deliveryOption: '',
    });
  }

  ngOnInit(): void {}
}
