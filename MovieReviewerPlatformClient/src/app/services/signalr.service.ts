import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { UserCommentDto } from '../models/userCommentDto';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection: signalR.HubConnection | undefined;
  private commentSubject = new BehaviorSubject<UserCommentDto>(new UserCommentDto());
  comment$ = this.commentSubject.asObservable();

  private connectionStatusSubject = new BehaviorSubject<signalR.HubConnectionState>(
    signalR.HubConnectionState.Disconnected,
  );
  connectionStatus$ = this.connectionStatusSubject.asObservable();

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7001/commentHub')
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.addConnectionListeners();
  }

  private addConnectionListeners() {
    if (this.hubConnection) {
      this.hubConnection.onclose((error) => {
        console.error('SignalR connection closed:', error);
        this.connectionStatusSubject.next(signalR.HubConnectionState.Disconnected);
      });

      this.hubConnection.onreconnecting((error) => {
        console.warn('SignalR reconnecting...', error);
        this.connectionStatusSubject.next(signalR.HubConnectionState.Reconnecting);
      });

      this.hubConnection.onreconnected((connectionId) => {
        console.log('SignalR reconnected:', connectionId);
        this.connectionStatusSubject.next(signalR.HubConnectionState.Connected);
      });
    }
  }

  public startConnection() {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      this.hubConnection
        .start()
        .then(() => console.log('SignalR connection started'))
        .catch((err) => console.error('Error while establishing SignalR connection:', err));
    }
  }

  public addCommentListener() {
    if (this.hubConnection) {
      this.hubConnection.on('ReceiveComment', (comentDto: UserCommentDto) => {
        console.log(`New comment on movie ${comentDto.movieId}: ${comentDto.comment}`);
        this.commentSubject.next(comentDto);
      });
    }
  }

  public joinMovieGroup(movieId: string) {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection
        .send('JoinMovieGroup', movieId)
        .then(() => console.log(`Joined group for movie ${movieId}`))
        .catch((err) => console.error('Error joining movie group:', err));
    }
  }

  public leaveMovieGroup(movieId: string) {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection
        .send('LeaveMovieGroup', movieId)
        .then(() => console.log(`Left group for movie ${movieId}`))
        .catch((err) => console.error('Error leaving movie group:', err));
    }
  }

  public stopConnection() {
    if (this.hubConnection) {
      this.hubConnection
        .stop()
        .then(() => {
          console.log('SignalR connection stopped');
          this.connectionStatusSubject.next(signalR.HubConnectionState.Disconnected);
        })
        .catch((err) => console.error('Error stopping SignalR connection:', err));
    }
  }
}
