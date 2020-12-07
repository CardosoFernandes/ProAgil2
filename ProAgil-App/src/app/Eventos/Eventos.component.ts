import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EMPTY } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-Eventos',
  templateUrl: './Eventos.component.html',
  styleUrls: ['./Eventos.component.css']
})
export class EventosComponent implements OnInit {

  // tslint:disable-next-line: variable-name
  // tslint:disable-next-line: variable-name
  _filtroLista!: string;
  public get filtroLista(): string {
    return this._filtroLista;
  }

  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.FiltrarEventos(this.filtroLista) : this.eventos;
  }

  eventos: any = []; // Variável que pode assumir qualquer tipo de dados... [any]
  eventosFiltrados: any = [];
  imagemAltura = 50;
  imagemMargen = 2;
  mostrarImagem = false;

  constructor(private http: HttpClient) { }

  // O Método OnInit serve para executar alguns métodos com instruções específicas antes do HTML ser montado!
  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.GetEventos();
  }

  FiltrarEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (      evento: { tema: string; }) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  // tslint:disable-next-line: typedef
  alternarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
  }

  // Hero function -> fará uma requisição por http ao controlador WeatherForecast para preench
  // preenche a variável "eventos"
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
