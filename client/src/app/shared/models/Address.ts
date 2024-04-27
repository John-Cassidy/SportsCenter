export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UserAddress {
  email: string;
  address?: Address;
}
