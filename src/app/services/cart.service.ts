import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {

    // check if the item already exists in the cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;
    if (this.cartItems.length > 0) 
      existingCartItem = this.cartItems.find( tempItem => tempItem.id === theCartItem.id);
    

    // check if it is found
    alreadyExistsInCart = existingCartItem != undefined;
    if (alreadyExistsInCart)
      existingCartItem!.quantity++;
    else
      this.cartItems.push(theCartItem);

    this.computeCartTotal();
  }

  computeCartTotal() {
    
    let totalPriceValue : number = 0;
    let totalQuantityValue : number = 0;

    for ( let currItem of this.cartItems ) {

      totalPriceValue += currItem.quantity * currItem.unitPrice;
      totalQuantityValue += currItem.quantity;
    }
    // publish the new values ... all the subscribers will receice the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }
}