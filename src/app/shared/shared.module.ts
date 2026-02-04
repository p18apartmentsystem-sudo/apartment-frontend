import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalLoaderComponent } from './components/global-loader/global-loader.component';
import { AlertComponent } from './components/alert/alert.component';

@NgModule({
  declarations: [
    GlobalLoaderComponent,
    AlertComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GlobalLoaderComponent,
    AlertComponent
  ]
})
export class SharedModule {}
