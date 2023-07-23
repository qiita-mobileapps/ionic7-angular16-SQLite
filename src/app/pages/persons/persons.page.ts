import { Component, OnInit } from '@angular/core';
import { Person } from '../../interfaces/person';
import { SqliteService } from '../../services/sqlite.service';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.page.html',
  styleUrls: ['./persons.page.scss'],
})
export class PersonsPage implements OnInit {

  constructor(
    private sqliteService: SqliteService
  ) {}

  persons: Person[] = [];
  person: any = {};

  ngOnInit() {
    this.sqliteService.getDatabaseState().subscribe((isReady: any) => {
      if (isReady) {
        this.sqliteService.getPersons().subscribe((datas: any) => {
          this.persons = datas;
        });
      }
    });
  }

  addPerson() {
    this.sqliteService.addPerson(this.person['name'])
    .then(() => {
      this.person = {};
    });
  }

}
