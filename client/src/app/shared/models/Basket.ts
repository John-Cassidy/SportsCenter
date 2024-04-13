import { v4 as uuidv4 } from 'uuid';

export interface Basket {
  id: string;
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
  items: BasketItem[];

  constructor(id: string = '', items: BasketItem[] = []) {
    this.id = id || uuidv4(); // Generate a GUID if the id is empty
    this.items = items;
  }
}
