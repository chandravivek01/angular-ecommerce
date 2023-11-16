import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage : Storage = sessionStorage;

  constructor() { 

    const data = this.storage.getItem('cartItems');

    if ( data != null ) {

      this.cartItems = JSON.parse(data);
      this.computeCartTotal();
    }
  }

  decrementQuantity(item: CartItem) {
    
    item.quantity--;
    if ( item.quantity === 0 )
     this.remove(item);
    else
      this.computeCartTotal();
  }

  remove(item: CartItem) {
    
    const itemIndex = this.cartItems.findIndex(tempItem => tempItem.id === item.id);
    if ( itemIndex > -1 )
      this.cartItems.splice(itemIndex, 1);

    this.computeCartTotal();
  }

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
    this.persistCartItems();
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
} 

