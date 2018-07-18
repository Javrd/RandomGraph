import { Component, OnInit } from '@angular/core';
import { Axis } from '../../models/axis';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  x: Axis = new Axis();
  y: Axis = new Axis();
  constructor(private messages: MessagesService) {
  }

  ngOnInit() {
    this.messages.sendMsg({'action': 'getXInfo'});
    this.messages.sendMsg({'action': 'getYInfo'});
    this.messages.messages.subscribe(msg => {
      if (msg.action === 'info') {
        this[msg.axis].min = msg.min;
        this[msg.axis].max = msg.max;
        this[msg.axis].time = msg.time;
        this[msg.axis].status = msg.status;
      }
    });
  }

  updateConf() {
    const xConf = Object.assign(this.x, {'action': 'updateX'});
    const yConf = Object.assign(this.y, {'action': 'updateY'});
    this.messages.sendMsg(xConf);
    this.messages.sendMsg(yConf);
  }

}
