import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { NgxSpinnerModule } from 'ngx-spinner';
import { GalleryModule } from 'ng-gallery';
import { NgxUploaderModule } from 'ngx-uploader';
import { TimeagoModule } from 'ngx-timeago';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ToastrModule.forRoot({ positionClass: 'toast-bottom-right' }),
    NgxSpinnerModule,
    GalleryModule,
    NgxUploaderModule,
    TimeagoModule.forRoot()
  ],
  exports: [
    FontAwesomeModule,
    ToastrModule,
    NgxSpinnerModule,
    GalleryModule,
    NgxUploaderModule,
    TimeagoModule
  ]
})
export class SharedModule { }
