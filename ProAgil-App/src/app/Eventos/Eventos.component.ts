import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { templateJitUrl } from '@angular/compiler';
defineLocale('pt-br', ptBrLocale); 

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-Eventos',
  templateUrl: './Eventos.component.html',
  styleUrls: ['./Eventos.component.css']
})

export class EventosComponent implements OnInit {

  //#region Variáveis e propriedades
  eventos: Evento[]; // Variável que pode assumir qualquer tipo de dados... [any]
  evento: Evento;
  eventosFiltrados: Evento[] = [];
  imagemAltura = 50;
  imagemMargen = 2;
  mostrarImagem = false;
  // modalRef: BsModalRef;
  registerForm: FormGroup;
  saveMode = 'post';
  bodyDeletarEvento: string;

  // tslint:disable-next-line: variable-name
  _filtroLista: string;
  public get filtroLista(): string {
    return this._filtroLista;
  }

  public set filtroLista(value: string) {
    this._filtroLista = value;
    // tslint:disable-next-line: triple-equals
    this.eventosFiltrados = this.filtroLista.length != 0 ? this.FiltrarEventos(this.filtroLista) : this.eventos;

    // tslint:disable-next-line: max-line-length
    // this.eventosFiltrados = [{id: 2, local: 'as', dataEvento: new Date('2021-06-21 18:20:00') , tema: 'Teste', qtdPessoas: 30, telefone:'', email:'', imagemUrl:'', palestranteEventos: [] , lotes: [], redesSociais: [] }];
  }
  //#endregion


  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService: BsLocaleService
    ) { this.localeService.use('pt-br'); }
  
  // O Método OnInit serve para executar alguns métodos com instruções específicas antes do HTML ser montado!
  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.validation();
    this.GetEventos();
  }

  // tslint:disable-next-line: typedef
  alternarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
  }

  //#region Código relacionado com os Eventos

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

  FiltrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (      evento: { tema: string; }) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  //#endregion

  //#region Modal Area


  /* O que foi aplicado na função de validação é a mesma coisa que no código abaixo comentado.
  validation(){
    this.registerForm = new FormGroup({
      tema: new FormControl('',
      [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
      local: new FormControl('', Validators.required),
      dataEvento: new FormControl('', Validators.required),
      qtdPessoas: new FormControl('',
      [Validators.required, Validators.min(0) ,Validators.max(120000)]),
      imagemURL: new FormControl('', Validators.required),
      telefone: new FormControl('', Validators.required),
      email: new FormControl('',
      [Validators.required, Validators.email]),
    })
  } */
  
  // tslint:disable-next-line: typedef
  validation(){
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.min(0) ,Validators.max(120000)]],
      imagemUrl: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // tslint:disable-next-line: typedef
  // openModal(template: TemplateRef<any>){
  //   this.modalRef = this.modalService.show(template, {ignoreBackdropClick: true});
  // }

  novoEvento(template: any){
    this.saveMode = 'post';
    this.openModal(template);

  }

  // tslint:disable-next-line: typedef
  editarEvento(template: any, _evento: Evento){
    this.saveMode = 'put';
    this.openModal(template);
    this.evento = _evento;
    this.registerForm.patchValue(_evento);
    
    /* this.eventoService.getEventoById(_evento.id).subscribe(
      // tslint:disable-next-line: variable-name
      (_resultado: Evento) => {
        console.log(_resultado);
        this.evento = Object.assign({}, this.registerForm.value);
        this.registerForm.patchValue(_resultado);
      }
    ); */
  }

  openModal(template: any){
    this.registerForm.reset();
    template.show();
  }

  // tslint:disable-next-line: typedef
  salvarAlteracao(template: any){
    debugger;
    if (!this.registerForm.invalid){

      if (this.saveMode === 'post'){

        this.evento = Object.assign({}, this.registerForm.value);
        this.eventoService.postEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.GetEventos();
          }, error => {
            console.log(error);
          }
        );

      } else {
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.GetEventos();
          }, error => {
            console.log(error);
          }
        );
      }
      
    }
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Id: ${evento.id}`;
  }
  
  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.GetEventos();
        }, error => {
          console.log(error);
        }
    );
  }
  //#endregion
  
}
