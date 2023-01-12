import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/services/manage/localstorage.service';
import { Observable } from 'rxjs';
//Services
import { RobotsService } from 'src/app/services/robots.service';
import { AuthService } from 'src/app/services/auth/auth.service';
//Icons
import { faFaceGrin } from '@fortawesome/free-solid-svg-icons';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
//Models
import { myData } from 'src/app/models/myData.model';
import { Robot } from 'src/app/models/Robot.model';
import { ActasService } from 'src/app/servicios/Actas/actas.service';
declare function loader(): any;
declare function closeAlert(): any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  //Observable
  myData$: Observable<myData>;
  //Icons
  faFaceGrin = faFaceGrin;
  faPowerOff = faPowerOff;
  faAddressCard = faAddressCard;
  faKey = faKey;
  //Captha Image
  imageToShow: any;
  myRol: string = '';
  robothandle: any = [];
  Limites: any = [];
  Actas_Limite: any;
  actas_current: any;
  isImageLoading: boolean = false;

  //new Instruction
  instruction: any = [];
  NewAccessToken: string = '';
  constructor(
    private actas: ActasService,
    private robots: RobotsService,
    private auth: AuthService
  ) {
    this.myData$ = auth.GetMyData;
  }

  ngOnInit(): void {
    loader();
    this.myData$.subscribe((data) => {
      this.myRol = data.rol;
      this.GiveMeUserLimit(data.username);
      switch (data.rol) {
        case 'Admin':
          this.GiveSIDRobots();
          break;
        case 'Supervisor':
          break;
      }
    });
  }
  GiveMeUserLimit(user: any) {
    this.robots.GetUserLimit(user).subscribe((data) => {
      this.Limites = data;
      closeAlert();
      for (let i = 0; i < this.Limites.length; i++) {
        const element = this.Limites[i];

        this.Actas_Limite = element.actas_limit;
        this.actas_current = element.actas_current;
      }
    });
  }

  GiveMeAllRobots() {
    this.robots.GetAllRobots().subscribe((data) => {
      this.robothandle = data;
      console.log(this.robothandle);
    });
  }
  GiveSIDRobots() {
    this.robots.GetRobots_SID().subscribe((data) => {
      this.robothandle = data;
      console.log(this.robothandle);
    });
  }

  GiveMeCaptcha() {
    this.robots.Captcha('robot2').subscribe(
      (data) => {
        this.createImageFromBlob(data);
      },
      (err) => {
        // console.log("error");
      }
    );
  }

  Instruction(instruction: string, robot: Robot) {
    switch (instruction) {
      case 'off':
        this.instruction = [instruction, robot];
        document
          .getElementById('modal')
          ?.setAttribute('style', 'display: block;');
        document
          .getElementById('confirmRequest')
          ?.setAttribute('style', 'display: block;');
        break;
      case 'on':
        this.instruction = [instruction, robot];
        document
          .getElementById('modal')
          ?.setAttribute('style', 'display: block;');
        document
          .getElementById('confirmRequest')
          ?.setAttribute('style', 'display: block;');
        break;
      case 'changeAccessToken':
        this.instruction = [instruction, robot];
        document
          .getElementById('modal')
          ?.setAttribute('style', 'display: block;');
        document
          .getElementById('changeToken')
          ?.setAttribute('style', 'display: block;');
        break;
    }
  }

  NextStep() {
    switch (this.instruction[0]) {
      case 'changeAccessToken':
        document
          .getElementById('changeToken')
          ?.setAttribute('style', 'display: none;');
        document
          .getElementById('confirmRequest')
          ?.setAttribute('style', 'display: block;');
        break;
    }
  }

  Send() {
    switch (this.instruction[0]) {
      case 'off':
        this.robots
          .UpNewInstruction(this.instruction[0], this.instruction[1].name)
          .subscribe(
            (data) => {
              console.log(data);
              this.instruction = [];
              document
                .getElementById('modal')
                ?.setAttribute('style', 'display: none;');
              document
                .getElementById('confirmRequest')
                ?.setAttribute('style', 'display: none;');
              this.GiveSIDRobots();
            },
            (err) => {
              this.auth.Unauth();
            }
          );

        break;
      case 'on':
        this.robots
          .UpNewInstruction(this.instruction[0], this.instruction[1].name)
          .subscribe(
            (data) => {
              console.log(data);
              this.instruction = [];
              document
                .getElementById('modal')
                ?.setAttribute('style', 'display: none;');
              document
                .getElementById('confirmRequest')
                ?.setAttribute('style', 'display: none;');
              this.GiveSIDRobots();
            },
            (err) => {
              this.auth.Unauth();
            }
          );
        break;

      case 'changeAccessToken':
        this.robots
          .UpNewInstruction(
            `${this.instruction[0]}=${this.NewAccessToken}`,
            this.instruction[1].name
          )
          .subscribe(
            (data) => {
              this.instruction = [];
              this.NewAccessToken = '';
              document
                .getElementById('modal')
                ?.setAttribute('style', 'display: none;');
              document
                .getElementById('confirmRequest')
                ?.setAttribute('style', 'display: none;');
              this.GiveSIDRobots();
            },
            (err) => {
              this.auth.Unauth();
            }
          );
        break;
    }
  }

  CancelModal() {
    this.instruction = [];
    document.getElementById('modal')?.setAttribute('style', 'display: none;');
    document
      .getElementById('confirmRequest')
      ?.setAttribute('style', 'display: none;');
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.imageToShow = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
