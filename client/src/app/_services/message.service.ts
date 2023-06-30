import { Injectable } from '@angular/core';
import { getPaginatedResult, setPaginationQueryStringParams } from './paginationHelper';
import { Message } from '../_models/message';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMessages(container: string, pageNumber: number, pageSize: number) {
    let params = setPaginationQueryStringParams(pageNumber, pageSize);
    params = params.set('container', container);

    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  }

  addMessage(username: string, content: string) {
    return this.http.post<Message>(this.baseUrl + 'messages', { recipientUsername: username, content });
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
