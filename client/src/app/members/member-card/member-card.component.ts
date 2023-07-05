import { Component, Input } from '@angular/core';
import { faEnvelope, faThumbsUp, faUser } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { LikesService } from 'src/app/_services/likes.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})

export class MemberCardComponent {
  @Input() member: Member;
  faUser = faUser;
  faThumbsup = faThumbsUp;
  faEnvlope = faEnvelope;

  constructor(private likesService: LikesService, private toastr: ToastrService, public presenceService: PresenceService) {}

  addLike(member: Member) {
    this.likesService.addLike(member.username).subscribe(_ => {
      this.toastr.success('You liked ' + member.knownAs);
    });
  }
}
