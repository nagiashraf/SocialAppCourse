import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ToastrModule.forRoot({ positionClass: 'toast-bottom-right' })
  ],
  exports: [
    FontAwesomeModule,
    ToastrModule
  ]
})
export class SharedModule { }
