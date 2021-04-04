import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { ToastrService } from 'ngx-toastr';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
defineLocale('pt-br', ptBrLocale); 

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-Eventos',
  templateUrl: './Eventos.component.html',
  styleUrls: ['./Eventos.component.css']
})

export class EventosComponent implements OnInit {

  //#region Variáveis e propriedades
  titulo: string = "Eventos";
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
  file: File;
  modalTitle: string;
  fileNameToUpdate: string = '';
  dataActual: string;

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
      private eventoService: EventoService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
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
      (evento: { tema: string; local: string}) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
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
    this.modalTitle = 'Novo evento💰';
    this.saveMode = 'post';
    this.openModal(template);
  }

  // tslint:disable-next-line: typedef
  editarEvento(template: any, _evento: Evento){
    debugger;
    this.modalTitle = 'Editar evento💰';
    this.saveMode = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, _evento);
    this.fileNameToUpdate = _evento.imagemUrl.toString();
    this.evento.imagemUrl = '';
    this.registerForm.patchValue(this.evento);
    
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

  OnFileChange(event){
    const reader = new FileReader();
    if (event.target.files && event.target.files.length){
      this.file = event.target.files;
      console.log(this.file);
    }
  }


  uploadImagem(){
    if (this.saveMode === 'post'){
      const nomeArquivo = this.evento.imagemUrl.split('\\', 3);
      this.evento.imagemUrl = nomeArquivo[2];

      this.eventoService.postUpload(this.file, nomeArquivo[2]).subscribe(
        () => {
          this.dataActual = new Date().getMilliseconds().toString();
          this.GetEventos();
        }
      );
    }else{
      this.evento.imagemUrl = this.fileNameToUpdate;
      this.eventoService.postUpload(this.file, this.fileNameToUpdate).subscribe(
        () => {
          this.dataActual = new Date().getMilliseconds().toString();
          this.GetEventos();
        }
      );
    }
    
  }

  // tslint:disable-next-line: typedef
  salvarAlteracao(template: any){
    if (!this.registerForm.invalid){
      if (this.saveMode === 'post'){
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.postEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.GetEventos();
            this.toastr.success('Evento criado com sucesso!', ' ✨');
          }, error => {
            this.toastr.error('Não foi possível inserir o evento!', '✨');
            console.log(error);
          }
        );

      } else {
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
        
        this.uploadImagem();

        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.GetEventos();
            this.toastr.success('Evento criado com sucesso!', '✨');
          }, error => {
            this.toastr.error('Não foi possível editar o evento!', '✨');
            console.log(error);
          }
        );
      }
      
    }
  }
  
  excluirEvento(evento: Evento, template: any) {
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Id: ${evento.id}`;
    this.openModal(template);
  }
  
  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.GetEventos();
          this.toastr.success('Evento apagado com sucesso!', 'Toastr fun!');
        }, error => {
          this.toastr.error('Não foi possível apagar o evento!', 'Toastr fun!');
          console.log(error);
        }
    );
  }
  //#endregion
  
}
