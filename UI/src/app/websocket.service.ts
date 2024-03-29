import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs-compat';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket;

  constructor() { }

  connect(): Rx.Subject<MessageEvent> {
    this.socket = io(environment.ws);

    const observable = new Observable(obs => {
      this.socket.on('messages', (data) => {
        console.log('Recived message from websocket server');
        obs.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    const observer = {
      next: (data: Object) => {
        this.socket.emit('messages', data);
      }
    };

    return Rx.Subject.create(observer, observable);
  }
}
