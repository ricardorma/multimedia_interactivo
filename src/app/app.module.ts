import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { VideoLComponent } from './components/videoL/videoL.component';

import { HttpClientModule } from '@angular/common/http';

//videogular
//import { VgControlsModule } from 'videogular2/compiled/controls';
import { VgCoreModule, } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { NgxVideoTimelineModule } from 'ngx-video-timeline';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    VideoLComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxDropzoneModule,
    VgCoreModule,
    HttpClientModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    NgxVideoTimelineModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


