import { Component, Input } from '@angular/core';
import { faEnvelope, faHeart, faThumbsUp, faUser } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { LikesService } from 'src/app/_services/likes.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})

export class MemberCardComponent {
  faUser = faUser;
  faThumbsup = faThumbsUp;
  faEnvlope = faEnvelope;
  @Input() member: Member;

  constructor(private likesService: LikesService, private toastr: ToastrService) {}

  addLike(member: Member) {
    this.likesService.addLike(member.username).subscribe(_ => {
      this.toastr.success('You liked ' + member.knownAs);
    });
  }
}
