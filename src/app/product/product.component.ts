import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../_services';
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators
  } from "@angular/forms";
import { Product,ProductSubCategory,ProductCategory } from '../_models';
import { AlertService } from '../_services';
import { Router } from '@angular/router';

@Component({ 
        selector:'app-product',
        templateUrl: 'product.component.html',
        styleUrls:['./product.component.scss'] })
export class ProductComponent implements OnInit {
    @ViewChild("productmodal", { static: false }) addProduct: any;
    public productSubCategories=ProductSubCategory;
    public productCategories=ProductCategory;
    public productForm: FormGroup;
    public lsitOfProducts:Product[];
    public filterCategory:ProductCategory;
    public productName='';
    constructor(private _productService:ProductService,
                private modalService: NgbModal,
                private fb: FormBuilder,
                private config: NgbModalConfig,
                private router:Router,
                private _alertService:AlertService) {
                    this.config.backdrop = "static";
                    this.config.keyboard = false;
    }

    ngOnInit() {
        this.lsitOfProducts=[];
        this.intializeProduct();
        this.enumerateProducts();
    }

    private enumerateProducts():void{
        this._productService.enumerateProducts()
        .subscribe(products=>{
            console.log(products);
            this.lsitOfProducts=products;
        })
    }

    private intializeProduct(): void {
        this.productForm = this.fb.group({
            name: new FormControl('',Validators.compose([Validators.required])),
            price: new FormControl('',Validators.compose([Validators.required])),
            category: new FormControl('',Validators.compose([Validators.required])),
            subCategory: new FormControl('',Validators.compose([Validators.required])),
            url: new FormControl('',Validators.compose([Validators.required])),
            description: new FormControl('',Validators.compose([Validators.required]))
        });
      } // private intializeProduct(): void

    public openProductForm():void {
        this.modalService.open(this.addProduct, { centered: true });
    }// public openProductForm():void

    public addNewProduct():void{
        console.log(this.productForm.value);
        const newProduct=new Product('',this.productForm.value.name,this.productForm.value.price,
                            this.productForm.value.category,this.productForm.value.subCategory,
                            this.productForm.value.description,this.productForm.value.url);
        this._productService.createNewProduct(newProduct)
        .subscribe(productResponse=>{
                this._alertService.success('successfully created product',true);
                this.clearMessage();
                this.modalService.dismissAll();
                this.enumerateProducts();
        },(err)=>{
            this._alertService.error('Error while creating product',true);
            this.clearMessage();
            this.modalService.dismissAll();
        })
    }

    private clearMessage(){
        setTimeout(()=>{
            this._alertService.clear();
        },3000);
    }

    public filterByCategory(argValue){
        console.log(argValue);
        this.filterCategory=argValue;
    }

    public getProductDetails(argId):void{
        this.router.navigate(['/product/',argId]);
    }// public getProductDetails(argId):void

}