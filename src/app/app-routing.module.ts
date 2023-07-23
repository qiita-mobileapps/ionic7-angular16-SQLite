import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'persons',
    pathMatch: 'full'
  },
  {
    path: 'persons',
    loadChildren: () => import('./pages/persons/persons.module').then( m => m.PersonsPageModule)
  },
  {
    path: 'persons/:id',
    loadChildren: () => import('./pages/person/person.module').then( m => m.PersonPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
