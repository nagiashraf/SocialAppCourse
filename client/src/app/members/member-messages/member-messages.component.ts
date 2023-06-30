import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent {
  @Input() messages: Message[];
  @Input() username: string;
  @ViewChild('messageForm') messageForm: NgForm;
  faClock = faClock;
  messageContent: string;

  constructor(private messageService: MessageService) {}

  addMessage() {
    this.messageService.addMessage(this.username, this.messageContent).subscribe(message => {
      this.messages.push(message)
      this.messageForm.reset();
    });
  }
}
