import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../_models/Evento';


@Injectable({
  providedIn: 'root'
})

export class EventoService {
  baseURL = 'http://localhost:5000/api/evento';

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  getAllEvento(): Observable<Evento[]>{
    return this.http.get<Evento[]>(this.baseURL);
  }

  getEventoByTema(tema: string): Observable<Evento[]>{
    return this.http.get<Evento[]>(`${this.baseURL}/getByTema/${tema}`);
  }

  getEventoById(id: number): Observable<Evento>{
    return this.http.get<Evento>(`${this.baseURL}/${id}`);
  }

  // tslint:disable-next-line: typedef
  postEvento(evento: Evento){
    return this.http.post(this.baseURL, evento);
  }

  // tslint:disable-next-line: typedef
  putEvento(evento: Evento){
    debugger;
    return this.http.put(`${this.baseURL}/${evento.id}`, evento);
    //return this.http.put(this.baseURL, evento);
  }

  deleteEvento (id: number){
    return this.http.delete(`${this.baseURL}/${id}`);
  }
  
}
