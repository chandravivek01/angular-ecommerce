import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  // templateUrl: './product-list.component.html',
  // templateUrl: './product-list-table.component.html',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = 'Books';

  // property for search
  searchMode: boolean = false;

  // properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = "";

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  addToCart(theProduct: Product) {

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }

  updatePageSize(pageSize: string) {

    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode)
      this.handleSearchProducts();

    else
      this.handleListProducts();
  }

  handleListProducts() {

    // check if id param is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {

      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }

    // if category-id is not available, then default to category-id = 1
    else {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    if (this.previousCategoryId != this.currentCategoryId)
      this.thePageNumber = 1;

    this.previousCategoryId = this.currentCategoryId;

    // this.productService.getProductList(this.currentCategoryId).subscribe(
    //   data => this.products = data
    // )

    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(
      data => {
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
        this.products = data._embedded.products;
      }
    );

  }

  handleSearchProducts() {

    const theKeyword = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword != theKeyword)
      this.thePageNumber = 1;

    this.previousKeyword = theKeyword;

    // this.productService.searchProducts(theKeyword).subscribe(
    //   data => this.products = data
    // );

    this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, theKeyword).subscribe(
      data => {
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
        this.products = data._embedded.products;
      }
    );
  }
}
