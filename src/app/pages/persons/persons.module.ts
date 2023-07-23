
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { PersonsPage } from './persons.page';
import { PersonsPageRoutingModule } from './persons-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonsPageRoutingModule
  ],
  declarations: [PersonsPage]
})
export class PersonsPageModule {}
