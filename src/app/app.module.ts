import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CollectionsComponent } from './collections/collections.component';
import { CollectionDetailComponent } from './collection-detail/collection-detail.component';
import { CollectionService } from './collection.service';
import { MessageService } from './message.service';
import { MessagesComponent } from './messages/messages.component';
import { AppRoutingModule } from './/app-routing.module';
import { CoversComponent } from './covers/covers.component';
import { SongsComponent } from './songs/songs.component';
import { CollectionSongsComponent } from './collection-songs/collection-songs.component';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { HttpClientModule } from '@angular/common/http';
import { CoverService } from './cover.service';


@NgModule({
  declarations: [
    AppComponent,
    CollectionsComponent,
    CollectionDetailComponent,
    MessagesComponent,
    CoversComponent,
    SongsComponent,
    CollectionSongsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    CollectionService,
    MessageService,
    CoverService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
