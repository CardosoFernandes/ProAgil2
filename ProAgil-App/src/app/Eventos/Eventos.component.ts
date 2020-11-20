import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-Eventos',
  templateUrl: './Eventos.component.html',
  styleUrls: ['./Eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventos: any;

  constructor(private http: HttpClient) { }

  // O Método OnInit serve para executar algumas instruções antes do HTML ser executado!
  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.GetEventos();
  }

  // tslint:disable-next-line: typedef
  GetEventos(){
    this.http.get('http://localhost:5000/WeatherForecast').subscribe(response => {
      this.eventos = response;
      console.log(response);
    }, error => {
      console.log(error);
    });
  }
}
