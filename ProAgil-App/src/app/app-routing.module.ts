import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactosComponent } from './contactos/contactos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventosComponent } from './Eventos/Eventos.component';
import { PalestrantesComponent } from './palestrantes/palestrantes.component';

const routes: Routes = [
  {path: 'eventos', component: EventosComponent},
  {path: 'palestrantes', component: PalestrantesComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'contactos', component: ContactosComponent},
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
