import {AfterViewInit, Component, ElementRef, HostListener, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {AppService} from "../../services/app.service";
import {GameService} from "../../services/game.service";
import Timer from "easytimer.js";
import {SuccessModalComponent} from "../shared/success-modal/success-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FailModalComponent} from "../shared/fail-modal/fail-modal.component";
import {PersonService} from "../../services/person.service";
import {AuthService} from "@auth0/auth0-angular";
import {Person} from "../../interfaces/person";
import {formatDate} from "@angular/common";
const timer = new Timer();

@Component({
  selector: 'app-mini-game',
  templateUrl: './mini-game.component.html',
  styleUrls: ['./mini-game.component.css'],
})
export class MiniGameComponent implements AfterViewInit, OnChanges {

  // @ts-ignore
  @ViewChild('canvas') public canvas: ElementRef;
  subscription: any;
  showLoader = true;
  timerStart = "00:00:00"
  timeNumber = 0

  constructor(
    private appService: AppService,
    private gameService: GameService,
    public modalService: NgbModal,
    public personService: PersonService,
    public authService: AuthService,
  ) {}

  private getPersonByID() {
    this.authService.user$.subscribe(
      res => (
        this.findUser(res)
      )
    )
  }

  private findUser(res: any | null | undefined) {
    if (res){
      this.personService.getPersonById(res.sub).subscribe(
        res => (
          this.personService.person = res as Person
        )
      )
    }
  }

  private startTimer() {
    timer.start()
    this.timeNumber = setInterval(() => {
      this.timerStart = timer.getTotalTimeValues().toString()
    }, 1);
  }

  public ngAfterViewInit() {
    this.getPersonByID()
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.appService.createPlayGround(canvasEl);
    this.subscription = this.appService.getImageLoadEmitter()
      .subscribe(() => {
        this.showLoader = false;
        this.gameService.startGameLoop();
        this.startTimer();
      });
    this.gameService.finishGameEvent.subscribe((item) => {
      if (item){
        let message = 'Simulación terminada en ' + this.timerStart
        this.openModalSuccess(message)
        let data = {
          "cedula": this.personService.person?.cedula,
          "nombre": this.personService.person?.nombre,
          "edad": this.personService.person?.edad,
          "fecha_Simulacion": formatDate(new Date(), 'YYYY-MM-ddThh:mm', 'en'),
          "iD_Persona": this.personService.person?.iD_Persona,
          "tiempo_Simulacion": this.timerStart,
        }
        this.updatePerson(data)
        timer.stop()
      }
    })
  }

  updatePerson(data: any) {
    this.personService.updatePerson(data).subscribe(
      res => {
        console.log(res);
      },
      err => {
        this.openModalFail("Ha ocurrido un error al guardar la simulacioón")
      }
    )
  }

  openModalFail(message?: string) {
    const modalRef = this.modalService.open(FailModalComponent);
    if(message) {
      modalRef.componentInstance.message = message;
    }
  }

  openModalSuccess(message?: string) {
    const modalRef = this.modalService.open(SuccessModalComponent);
    if (message) {
      modalRef.componentInstance.message = message;
    }
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.appService.movePlayer(event, 'keydown');
  }

  @HostListener('document:keyup', ['$event']) onKeyupHandler(event: KeyboardEvent) {
    this.appService.movePlayer(event, 'keyup');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }
}
