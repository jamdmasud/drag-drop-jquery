import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import { VideosComponent } from './videos/videos.component';
import { AudioComponent } from './audio/audio.component';


@NgModule({
  declarations: [
    AppComponent,
    VideosComponent,
    AudioComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    UiModule
  ],
  providers: [VideosComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
