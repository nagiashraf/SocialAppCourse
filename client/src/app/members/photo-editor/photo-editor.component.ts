import { Component, Input, EventEmitter } from '@angular/core';
import { faBan, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Member } from 'src/app/_models/member';
import { environment } from 'src/environments/environment';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs';
import { Photo } from 'src/app/_models/photo';
import { MembersService } from 'src/app/_services/members.service';


@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent {
  @Input() member: Member;
  faTrash = faTrash;
  faUpload = faUpload;
  faBan = faBan;
  baseUrl = environment.apiUrl;
  user: User;

  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;

  constructor(private accountService: AccountService, private membersService: MembersService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
    this.options = { 
      concurrency: 1,
      maxFileSize: 10000000,
      allowedContentTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/bmp']
    };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  setMainPhoto(photo: Photo) {
    this.membersService.setMainPhoto(photo.id).subscribe(() => {
      this.user.mainPhotoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(ph => {
        if (ph.isMain) ph.isMain = false;
        if (ph.id === photo.id) ph.isMain = true;
      });
    })
  }

  deletePhoto(photoId: number) {
    this.membersService.deletePhoto(photoId).subscribe(() => {
      this.member.photos = this.member.photos.filter(ph => ph.id !== photoId);
    });
  }

  onUploadOutput(output: UploadOutput): void {
    switch (output.type) {
      case 'allAddedToQueue':
        break;
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          this.files[0] = output.file;
        }
        break;
      case 'uploading':
        if (typeof output.file !== 'undefined') {
          const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
          this.files[index] = output.file;
        }
        break;
      case 'removed':
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
        break;
      case 'dragOver':
        this.dragOver = true;
        break;
      case 'dragOut':
      case 'drop':
        this.dragOver = false;
        break;
      case 'done':
        const photo: Photo = output.file.response;
        if (photo) {
          this.member.photos.push(photo);
          this.files = [];
        }
        break;
    }
  }

  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.baseUrl + 'users/add-photo',
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.user.token
      }
    };

    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }
}
