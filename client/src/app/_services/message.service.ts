import { Injectable } from '@angular/core';
import { getPaginatedResult, setPaginationQueryStringParams } from './paginationHelper';
import { Message } from '../_models/message';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';
import { Group } from '../_models/group';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl: string = environment.apiUrl;
  hubUrl: string = environment.hubUrl;
  hubConnection: HubConnection;
  messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient) { }

  getMessages(container: string, pageNumber: number, pageSize: number) {
    let params = setPaginationQueryStringParams(pageNumber, pageSize);
    params = params.set('container', container);

    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }

  createHubConnection(user: User, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + "message?user=" + otherUsername, { accessTokenFactory: () => user.token })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('ReceiveMessgeThread', messages =>
      this.messageThreadSource.next(messages));

    this.hubConnection.on('NewMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe(messages => {
        this.messageThreadSource.next([...messages, message]);
      })
    });

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some(c => c.username === otherUsername)) {
        this.messageThread$.pipe(take(1)).subscribe(messages => {
          messages.forEach(message => {
            if(!message.dateRead) {
              message.dateRead = new Date(Date.now());
            }
          })
          this.messageThreadSource.next([...messages]);
        })
      }
    });
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  
  async addMessage(username: string, content: string) {
    this.hubConnection.invoke("SendMessage", { recipientUserName: username, content }).catch(error => console.log(error));
  }

  // USE SIGNALR INSTEAD OF API //

  // getMessageThread(username: string) {
  //   return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  // }
}
