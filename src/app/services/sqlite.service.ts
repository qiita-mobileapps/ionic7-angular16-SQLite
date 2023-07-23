import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Person } from "../interfaces/person";
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { SQLitePorter } from "@awesome-cordova-plugins/sqlite-porter/ngx";

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  
  constructor(
    private platform: Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    private http: HttpClient
  ) { 
    this.platform.ready().then(() => {
        this.sqlite.create({
          name: 'persons.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.onDatabase();
        });
      });
  }

  private database!: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  persons = new BehaviorSubject([]);

  onDatabase() {
    this.http.get('assets/initdb.sql', { responseType: 'text'})
    .subscribe((sql: any) => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(() => {
          this.loadPersons();
          this.dbReady.next(true);
        })
        .catch((e: any) => console.error(e));
    });
  }

  getDatabaseState(): Observable<boolean> {
    const dbState = this.dbReady.asObservable();
    return dbState;
  }

  getPersons(): Observable<Person[]> {
    return this.persons.asObservable();
  }

  async loadPersons(): Promise<[] | void> {
    const SQLStatement = 'SELECT * FROM person';
    const executedResult = await this.database.executeSql(SQLStatement, [])
    .then((data: any) => {
      const list: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          list.push({
            id: data.rows.item(i).id,
            name: data.rows.item(i).name
          });
        }
      }
      this.persons.next(list);
    });
    return executedResult;
  }

  async addPerson(name: string): Promise<Person[] | void> {
    const data = [name];
    const SQLStatement = 'INSERT INTO person (name) VALUES (?)';
    const executedResult = await this.database.executeSql(SQLStatement, data)
    .then(() => {
      this.loadPersons();
    });
    return executedResult;
  }

  async getPerson(id?: number): Promise<Person> {
    const data = [id];
    const SQLStatement = 'SELECT * FROM person WHERE id = ?';
    const executedResult = await this.database.executeSql(SQLStatement, data)
    .then((data: any) => {
     return {
        id: data.rows.item(0).id,
        name: data.rows.item(0).name
      };
    });
    return executedResult;
  }

  async deletePerson(id?: number): Promise<any> {
    const data = [id];
    const SQLStatement = 'DELETE FROM person WHERE id = ?';
    const executedResult = await this.database.executeSql(SQLStatement, data)
    .then(() => {
      this.loadPersons();
    });
    return executedResult;
  }

  async updatePerson(item: Person): Promise<any> {
    const data = [item.name, item.id];
    const SQLStatement = 'UPDATE person SET name = ? WHERE id = ?';
    const executedResult = await this.database.executeSql(SQLStatement, data)
    .then(() => {
      this.loadPersons();
    });
    return executedResult;
  }
}
