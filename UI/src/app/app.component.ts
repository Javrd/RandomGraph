import { Component, OnInit } from '@angular/core';
import {MessagesService} from './messages.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Random Graph';

  constructor(private messages: MessagesService) {}
  ngOnInit() {
    this.messages.messages.subscribe(msg => {
    });
  }
  sendMessage() {
    this.messages.sendMsg('Test Message');
  }
}
