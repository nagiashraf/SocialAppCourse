import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private toastr: ToastrService, private router: Router) { }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + "presence", { accessTokenFactory: () => user.token })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on("UserIsOnline", (username: string) => {
      this.onlineUsersSource.next([...this.onlineUsersSource.value, username]);
    });

    this.hubConnection.on("UserIsOffline", (username: string) => {
      this.onlineUsersSource.next(this.onlineUsersSource.value.filter(u => u !== username));
    });

    this.hubConnection.on("GetOnlineUsers", (onlineUsers: string[]) => {
      this.onlineUsersSource.next(onlineUsers);
    });

    this.hubConnection.on('NewMessageReceived', (username, knownAs) =>
      this.toastr.info(knownAs + ' sent you a new message!')
        .onTap
        .pipe(take(1))
        .subscribe(_ => this.router.navigate(['/members', username], {queryParams: {tab: 'messages'}})));
  }

  stopHubConnection() {
    this.hubConnection.stop();
  }
}
