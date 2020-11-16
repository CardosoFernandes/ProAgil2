import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-Eventos',
  templateUrl: './Eventos.component.html',
  styleUrls: ['./Eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventos: any = [
    {
      EventoId: 1,
      Tema: 'Angular',
      Local: 'Lisboa'
    },
    {
      EventoId: 2,
      Tema: '.Net Core',
      Local: 'Luanda'
    },
    {
      EventoId: 3,
      Tema: 'Angular & .Net Core',
      Local: 'Londres'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
