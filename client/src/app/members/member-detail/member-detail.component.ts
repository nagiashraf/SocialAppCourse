import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('tabs') tabs: ElementRef;
  @ViewChild('tabContents') tabContents: ElementRef;
  member: Member;
  images: GalleryItem[] = [];
  messages: Message[] = [];

  constructor(private route: ActivatedRoute, private messageService: MessageService) {}

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

  setImages() {
    for (let photo of this.member.photos) {
      this.images.push(new ImageItem({ src: photo?.url, thumb: photo?.url }));
    }
  }

  loadMessages() {
    if (this.messages.length === 0) {
      this.messageService.getMessageThread(this.member.username).subscribe(messages => {
        this.messages = messages;
      });
    }
  };

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
    if (event.detail.id === 'messages' && this.messages.length === 0) {
      this.loadMessages();
    }
  }
}
