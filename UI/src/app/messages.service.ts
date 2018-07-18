import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable, Subject } from 'rxjs-compat';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  messages: Subject<any>;

  constructor(private wsService: WebsocketService) {
    this.messages = <Subject<any>>wsService
      .connect()
      .map((response: any): any => {
        return JSON.parse(response);
      });
  }

  sendMsg(msg) {
    this.messages.next(JSON.stringify(msg));
  }
}
