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
