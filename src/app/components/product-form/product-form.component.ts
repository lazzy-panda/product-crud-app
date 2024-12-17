import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { selectProductById } from '../../store/product.selectors';
import { updateProduct, addProduct } from '../../store/product.actions';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Создание формы с дополнительными валидаторами
    this.productForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ]
      ],
      price: [
        0,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(1000000),
          Validators.pattern('^[0-9]*$')
        ]
      ],
      description: [
        '',
        [
          Validators.maxLength(200)
        ]
      ]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.isEditMode = true;
        this.productId = +params.get('id')!;

        this.store.select(selectProductById(this.productId)).subscribe(product => {
          if (product) {
            this.productForm.patchValue(product);
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const product: Product = {
      id: this.productId || Date.now(),
      ...this.productForm.value
    };

    if (this.isEditMode) {
      this.store.dispatch(updateProduct({ product }));
    } else {
      this.store.dispatch(addProduct({ product }));
    }

    this.router.navigate(['/']);
  }

  // Для удобного доступа к контроллам формы
  get f() {
    return this.productForm.controls;
  }
}
