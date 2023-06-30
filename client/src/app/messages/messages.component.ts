import { Component } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';
import { faEnvelope, faEnvelopeOpen, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  faEnvelope = faEnvelope;
  faEnvelopeOpen = faEnvelopeOpen;
  faPaperPlane = faPaperPlane;
  messages: Message[];
  pagination: Pagination;
  container = 'unread';
  pageNumber = 1;
  pageSize = 5;
  messagesLoading = false;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.messagesLoading = true;
    this.messageService.getMessages(this.container, this.pageNumber, this.pageSize).subscribe(response => {
      this.messages = response.result;
      this.pagination = response.pagination;
      this.messagesLoading = false;
    });
  };

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe(_ => {
      this.messages.splice(this.messages.findIndex(message => message.id === id), 1);
    });
  }

  onPageChanged(pageNumber: number) {
    if (this.pageNumber !== pageNumber) {
      this.pageNumber = pageNumber;
      this.loadMessages();
    }
  }
}
