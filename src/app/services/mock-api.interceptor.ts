import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  private products: Product[] = [];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/api/products')) {
      if (req.method === 'GET') {
        return of(new HttpResponse({ status: 200, body: this.products })).pipe(delay(500));
      }

      if (req.method === 'POST') {
        const newProduct = { ...req.body, id: Date.now() };
        this.products.push(newProduct);
        return of(new HttpResponse({ status: 201, body: newProduct })).pipe(delay(500));
      }

      if (req.method === 'PUT') {
        const index = this.products.findIndex(p => p.id === req.body.id);
        this.products[index] = req.body;
        return of(new HttpResponse({ status: 200, body: req.body })).pipe(delay(500));
      }

      if (req.method === 'DELETE') {
        this.products = this.products.filter(p => p.id !== req.body.id);
        return of(new HttpResponse({ status: 200 })).pipe(delay(500));
      }
    }
    return next.handle(req);
  }
}
