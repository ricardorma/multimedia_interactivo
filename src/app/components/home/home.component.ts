import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

declare var VTTCue;

export interface ICuePoint {
	id: string;
    title: string;
	description: string;
	tipoC : string;
	pregunta: string;
    respuestas: string [];
    respuestaC: string;
	tiempo1: number;
	tiempo2: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

	files: File[] = [];

	playlist = [
	  {
		title: 'Viajes en el tiempo',
		src: '../../assets/videoTiempo.mp4',
		type: 'video/mp4',
		track : '../../assets/cue-points.vtt'

	  },
	  {
		title: 'Dinosaurios',
		src: '../../assets/videoDinosaurios.mp4',
		type: 'video/mp4',
		track : '../../assets/cue2-points.vtt'
	  }
	];

  
	currentIndex = 0;
	currentItem = this.playlist[this.currentIndex];
	api;
	valorTiempo;
	t1;
	t2;
	activeCuePoints: ICuePoint[] = [];
    track: TextTrack;
	showCuePointManager = false;
	respuestaCorrecta = false;
	json: JSON = JSON;
	resultado: string;
	saltarCP = false;

	contadorMal = 0;


	constructor() {
	}

	onPlayerReady(api) {
	  this.api = api;
	  this.track = this.api.textTracks[ 0 ];
	  this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));
	  this.api.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));
	}
  
	nextVideo() {
	  this.currentIndex++;
  
	  if (this.currentIndex === this.playlist.length) {
		this.currentIndex = 0;
	  }
  
	  this.currentItem = this.playlist[this.currentIndex];
	  this.contadorMal = 0;
	  this.cambiar();
	}
  
	playVideo() {
	  this.api.play();
	}
  
	onClickPlaylistItem(item, index: number) {
	  this.currentIndex = index;
	  this.currentItem = item;
	}


    onEnterCuePoint($event) {
		this.activeCuePoints.push({"id":$event.id, ...JSON.parse($event.text)});
    }

    async onExitCuePoint($event) {
		if(!this.respuestaCorrecta && (this.activeCuePoints[0].tipoC.match("1"))){
			this.api.pause();
			await this.delay(3000);
			this.api.currentTime = this.activeCuePoints[0].tiempo1;
			this.api.play();
		}
		if(this.activeCuePoints[0].tipoC.match("2")){
			this.api.pause();
			await this.delay(1500);
			this.api.play();
			this.activeCuePoints = this.activeCuePoints.filter(c => c.id!==$event.id);
		} 
		else{
			this.activeCuePoints = this.activeCuePoints.filter(c => c.id!==$event.id);
			this.cambiar();
		}
	}

	delay(ms: number) {
		return new Promise( resolve => setTimeout(resolve, ms) );
	}
	
	saltar(){
		this.api.currentTime = this.api.currentTime + 3;
	}

	saltarCue(cue: TextTrackCue){
		this.api.currentTime = cue.startTime;
	}

	onSubmit(form: NgForm) {
		console.log(form.value)
		let valor = form.value.p1;
		if(valor == this.activeCuePoints[0].respuestaC){
			this.respuestaCorrecta = true;
			this.resultado = "Respuesta correcta"
		}else{
			this.resultado = "Respuesta incorrecta"
			this.contadorMal++;
		}
	}

	cambiar(){
		this.respuestaCorrecta = false;
		this.resultado = "";
		this.saltarCP = false;
	}
}
