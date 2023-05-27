import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from "../../_services/members.service";
import { Member } from 'src/app/_models/member';
import { GalleryItem, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member: Member;
  images: GalleryItem[] = [];

  constructor(private membersService: MembersService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const username = this.route.snapshot.paramMap.get('username');
    this.membersService.getMember(username).subscribe(member => {
      this.member = member
      this.setImages();
    });
  }

  setImages() {
    for (let photo of this.member.photos) {
      this.images.push(new ImageItem({ src: photo?.url, thumb: photo?.url }));
    }
  }
}
