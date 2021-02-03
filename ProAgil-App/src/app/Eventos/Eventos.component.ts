import { Component, OnInit } from '@angular/core';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';

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
    // tslint:disable-next-line: triple-equals
    this.eventosFiltrados = this.filtroLista.length != 0 ? this.FiltrarEventos(this.filtroLista) : this.eventos;
  }

  eventos: Evento[] = []; // Variável que pode assumir qualquer tipo de dados... [any]
  eventosFiltrados: Evento[] = [];
  imagemAltura = 50;
  imagemMargen = 2;
  mostrarImagem = false;

  constructor(private eventoService: EventoService) { }

  // O Método OnInit serve para executar alguns métodos com instruções específicas antes do HTML ser montado!
  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.GetEventos();
  }

  FiltrarEventos(filtrarPor: string): Evento[] {
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
    this.eventoService.getAllEvento().subscribe(
      // tslint:disable-next-line: variable-name
      (_eventos: Evento[]) => {
      this.eventos = _eventos;
      this.eventosFiltrados = this.eventos;
      console.log(_eventos);
    }, error => {
      console.log(error);
    });
  }
}
