import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { loadProducts, deleteProduct } from '../../store/product.actions';
import { selectAllProducts } from '../../store/product.selectors';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;

  constructor(private store: Store) {
    this.products$ = this.store.select(selectAllProducts);
  }

  ngOnInit(): void {
    this.store.dispatch(loadProducts());
  }

  onDeleteProduct(id: number): void {
    this.store.dispatch(deleteProduct({ id }));
  }
}
