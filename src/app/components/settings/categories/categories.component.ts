import { Component } from '@angular/core';
import { Category } from '../../../models';
import { CategoriesInterface } from '../../../interfaces';
import {NgxImageCompressService} from 'ngx-image-compress';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  constructor(private categoriesServices: CategoriesInterface,private imageCompress: NgxImageCompressService){}

  categories?: Category[];

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(){
    this.categoriesServices.getItemsByInstance().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (e) => console.error(e)
    })
  }

  imgResultBeforeCompression: string = '';
  imgResultAfterCompression: string = '';

  compressFile() {
      this.imageCompress.uploadFile().then(({image, orientation}) => {
          this.imgResultBeforeCompression = image;
          console.log('Size in bytes of the uploaded image was:', this.imageCompress.byteCount(image));

          this.imageCompress
              .compressFile(image, orientation, 50, 50) // 50% ratio, 50% quality
              .then(compressedImage => {
                  this.imgResultAfterCompression = compressedImage;
                  console.log('Size in bytes after compression is now:', this.imageCompress.byteCount(compressedImage));
              });
      });
  }
}
