import { Component, ElementRef, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tabs') tabs: ElementRef;
  @ViewChild('tabContents') tabContents: ElementRef;
  faUserCircle = faUserCircle;
  member: Member;
  images: GalleryItem[] = [];
  messages: Message[] = [];
  user: User;

  constructor(private route: ActivatedRoute, private messageService: MessageService, public presenceService: PresenceService,
    private accountService: AccountService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
    }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.member = data['loadedMember']);
    this.setImages();
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.setActiveTab(params['tab']);
      }
    });
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  setImages() {
    for (let photo of this.member.photos) {
      this.images.push(new ImageItem({ src: photo?.url, thumb: photo?.url }));
    }
  }

  setActiveTab(id: string) {
    const tabs = this.tabs.nativeElement;
    const tabContents = this.tabContents.nativeElement;
    const activeTab = tabs.querySelector('.active');
    const activeTabContent = tabContents.querySelector('.show.active');
    const targetTab = Array.from(tabs.querySelectorAll('.nav-link')).find((el: HTMLElement) => el.id === id + '-tab') as HTMLElement;
    const targetTabContent = Array.from(tabContents.querySelectorAll('.tab-pane')).find((el: HTMLElement) => el.id === id) as HTMLElement;

    activeTab.classList.remove('active');
    targetTab.classList.add('active');
    activeTabContent.classList.remove('active', 'show');
    targetTabContent.classList.add('active', 'show');

    targetTab.dispatchEvent(new CustomEvent('tabActivated', { detail: { id: id } }));
  }

  onMessageTabActivated(event: CustomEvent) {
    if (event.detail.id === 'messages') {
      this.messageService.createHubConnection(this.user, this.member.username)
    }
  }

  onTabClicked(id: string) {
    if (id === 'messages') {
      this.messageService.createHubConnection(this.user, this.member.username)
    } else {
      this.messageService.stopHubConnection();
    }
  }

  // USE SIGNALR INSTEAD OF API //

  // loadMessages() {
  //   if (this.messages.length === 0) {
  //     this.messageService.getMessageThread(this.member.username).subscribe(messages => {
  //       this.messages = messages;
  //     });
  //   }
  // };
}
