import { Address } from './Address';
import { DeliveryOption } from './DeliveryOption';
import { v4 as uuidv4 } from 'uuid';

export interface Basket {
  id: string;
  userName: string;
  items: BasketItem[];
}

export interface BasketItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  pictureUrl: string;
  productType: string;
  productBrand: string;
}

export class Basket implements Basket {
  id: string;
  userName: string;
  items: BasketItem[];

  constructor(
    id: string = '',
    userName: string = '',
    items: BasketItem[] = []
  ) {
    this.id = id || uuidv4(); // Generate a GUID if the id is empty
    this.userName = userName;
    this.items = items;
  }
}

export interface BasketTotal {
  shipping: number;
  subtotal: number;
  total: number;
}

export interface BasketCheckout {
  basketId: string;
  userName: string;
  shippingAddress: Address;
  deliveryOption: DeliveryOption | null;
  basketTotal: BasketTotal;
}

export class BasketCheckout implements BasketCheckout {
  basketId: string;
  userName: string;
  shippingAddress: Address;
  deliveryOption: DeliveryOption | null;
  basketTotal: BasketTotal;

  constructor(
    basketId: string = '',
    userName: string = '',
    shippingAddress: Address = {
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    deliveryOption: DeliveryOption | null = null,
    basketTotal: BasketTotal = { shipping: 0, subtotal: 0, total: 0 }
  ) {
    this.basketId = basketId;
    this.userName = userName;
    this.shippingAddress = shippingAddress;
    this.deliveryOption = null;
    this.basketTotal = basketTotal;
  }

  setDeliveryOption(deliveryOption: DeliveryOption | null) {
    this.deliveryOption = deliveryOption;
    this.basketTotal.shipping = deliveryOption?.price ?? 0;
    this.basketTotal.total =
      this.basketTotal.subtotal + this.basketTotal.shipping;
  }

  validate(): boolean {
    return (
      this.shippingAddress.firstName !== '' &&
      this.shippingAddress.lastName !== '' &&
      this.shippingAddress.street !== '' &&
      this.shippingAddress.city !== '' &&
      this.shippingAddress.state !== '' &&
      this.shippingAddress.zipCode !== '' &&
      this.deliveryOption !== null
    );
  }
}
