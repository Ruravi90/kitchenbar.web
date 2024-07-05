import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';

@NgModule(
    {
        imports:[
            FormsModule,
            ReactiveFormsModule,
            ButtonModule,
            SkeletonModule
        ],
        exports:[
            ReactiveFormsModule,
            ButtonModule,
            SkeletonModule
        ],
        providers:[]
    }
)

export class ImportModules{}