import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { WebsocketService } from './websocket.service';
import { MessagesService } from './messages.service';

import { AppComponent } from './app.component';
import { ConfigComponent } from './config/config.component';
import { GraphComponent } from './graph/graph.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent,
    GraphComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    WebsocketService,
    MessagesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
