import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from '@angular/core';
import { Person } from '../../interfaces/person';
import { SqliteService } from '../../services/sqlite.service';
import { ToastController } from "@ionic/angular";

@Component({
  selector: 'app-person',
  templateUrl: './person.page.html',
  styleUrls: ['./person.page.scss'],
})
export class PersonPage implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private sqliteService: SqliteService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.myid = this.activatedRoute.snapshot.paramMap.get("id");
  }

  person!: Person;
  myid: any = "";

  async ngOnInit() {
    this.person = await this.sqliteService.getPerson(this.myid);
  }

  deletePerson() {
    this.sqliteService.deletePerson(this.myid).then(() => {
      this.router.navigateByUrl("/");
    });
  }

  updatePerson(): void {
    this.person.id = this.myid;
    this.sqliteService.updatePerson(this.person).then(async () => {
      const toast = await this.toastController.create({
        message: "Person updated",
        duration: 2500,
      });
      toast.present();
    });
  }

}
