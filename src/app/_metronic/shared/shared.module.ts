import {NgModule} from '@angular/core';
import {KeeniconComponent} from './keenicon/keenicon.component';
import {CommonModule} from "@angular/common";
import { UppercaseDirective } from './uppercase.directive'

@NgModule({
  declarations: [
    KeeniconComponent, UppercaseDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    KeeniconComponent, UppercaseDirective
  ]
})
export class SharedModule {
}
