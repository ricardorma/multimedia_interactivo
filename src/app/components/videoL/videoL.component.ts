import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';


declare var VTTCue;

export interface ICuePoint {
    id: string;
    title: string;
    description: string;
    pregunta: string;
    respuestas: string [];
    respuestaC: string;
    tiempo1: number;
    tipo : string;
}

export interface infoCue {
    startTime: number;
    endTime: number;
    title: string;
    description: string;
    tiempo1: number;
    tipo : string;
}

export interface pregCue {
  startTime: number;
  endTime: number;
  title: string;
  pregunta: string;
  respuestas: string [];
  respuestaC: string;
  tiempo1: number;
  tipo: string;
}

@Component({
  selector: 'app-juego',
  templateUrl: './videoL.component.html',
  styleUrls: ['./videoL.component.css']
})
export class VideoLComponent {

  constructor(private domSanitizer: DomSanitizer) { }
    
	files: File[] = [];
	activeCuePoints: ICuePoint[] = [];
  track: TextTrack;


  showCuePointManager = false;
  borrarPuntos = false;
  anadirP = false;
  respuestaCorrecta = false;
  saltarCP = false;
  resultado: string;
  
  videoSRC;
	currentIndex = 0;
	currentItem = this.files[this.currentIndex];
	api;
  json: JSON = JSON;
  
	newCue: infoCue = {
        startTime: 0,
        endTime: 1,
        title: "Funcionamiento",
        description: "Funcion",
        tiempo1: 0,
        tipo: "1"
    };

  newPreg: pregCue = {
    startTime: 4,
    endTime: 7,
    title: "",
    pregunta: '',
    respuestas: ['', '', '', ''],
    respuestaC: '',
    tiempo1: 4,
    tipo: "2"
  }
  
	onPlayerReady(api) {
		this.api = api;
    this.track = this.api.textTracks[ 0 ];
	  this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));
	  this.api.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));
	}
  
	nextVideo() {
	  this.currentIndex++;
  
	  if (this.currentIndex === this.files.length) {
		this.currentIndex = 0;
	  }
    this.currentItem = this.files[this.currentIndex];
    

	}
  
	playVideo() {
	  this.api.play();
	}
  
	
	onSelect(event) {
		console.log(event);
    this.files.push(...event.addedFiles);
    this.videoSRC = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.files[0]));
	}

	onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
    if(this.files.length!=0)
      this.videoSRC = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.files[this.files.length-1]));
	}

	onSubmit(form: NgForm, event: Event) {
        event.preventDefault();

        if (form.valid) {
            const jsonData = {
                title: form.value.title,
                description: form.value.description,
                tiempo1: form.value.startTime,
                tipo: "1"
            };

            const jsonText = JSON.stringify(jsonData);

            this.track.addCue(
                new VTTCue(form.value.startTime, form.value.endTime, jsonText)
            );
        }
    }

    onSubmitP(form: NgForm, event: Event) {
      event.preventDefault();

      if (form.valid) {
          const jsonData = {
              title: form.value.title,
              pregunta: form.value.pregunta,
              respuestas : [form.value.respuesta1, form.value.respuesta2, form.value.respuesta3, form.value.respuesta4],
              respuestaC : form.value.respuestaC,
              tiempo1: form.value.startTime,
              tipo: "2"
          };

          const jsonText = JSON.stringify(jsonData);

          this.track.addCue(
              new VTTCue(form.value.startTime, form.value.endTime, jsonText)
          );
      }
  }

  
  submitRespuestas(form: NgForm) {
		console.log(form.value)
		let valor = form.value.p1;
		if(valor == this.activeCuePoints[0].respuestaC){
			this.respuestaCorrecta = true;
      this.resultado = "Respuesta correcta"
		}else{
      this.resultado = "Respuesta incorrecta"
		}
	}


    onClickRemove(cue: TextTrackCue) {
        this.track.removeCue(cue);
    }

    onEnterCuePoint($event) {
        this.activeCuePoints.push({"id":$event.id, ...JSON.parse($event.text)});
    }

    delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
    }


    async onExitCuePoint($event) {
      if(this.activeCuePoints[0].tipo.match("2") && !this.respuestaCorrecta){
        this.api.pause();
        await this.delay(3000);
        this.api.currentTime = this.activeCuePoints[0].tiempo1;
        this.api.play();
      }  else{
        this.activeCuePoints = this.activeCuePoints.filter(c => c.id!==$event.id);
        this.cambiar()
      }
        
    }
    
    saltarCue(cue: TextTrackCue){
		this.api.currentTime = cue.startTime;
    }
    
    saltar(){
		this.api.currentTime = this.api.currentTime + 5;
  }
  
  cambiar(){
		this.respuestaCorrecta = false;
		this.resultado = "";
	}
    
}
