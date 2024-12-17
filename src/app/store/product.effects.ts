import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ProductActions from './product.actions';
import { HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable()
export class ProductEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(() =>
        this.http.get<Product[]>('/api/products').pipe(
          map(products => ProductActions.loadProductsSuccess({ products }))
        )
      )
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
