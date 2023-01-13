import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

import { RequestsService } from 'src/app/services/requests/requests.service';
//Icons
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faCertificate } from '@fortawesome/free-solid-svg-icons';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
import { faPeopleArrowsLeftRight } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
declare function loader(): any;
declare function closeAlert(): any;
//Models
import { myData } from 'src/app/models/myData.model';
import Swal from 'sweetalert2';
import { Respuesta } from './req.model';
import { ActasService } from 'src/app/servicios/Actas/actas.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-actas',
  templateUrl: './actas.component.html',
  styleUrls: ['./actas.component.css'],
})
export class ActasComponent implements OnInit {
  _tableResult = '';
  //Icons
  faPaperPlane = faPaperPlane;
  faBook = faBook;
  faFileCirclePlus = faFileCirclePlus;
  faMagnifyingGlass = faMagnifyingGlass;
  faCertificate = faCertificate;
  faFileArrowDown = faFileArrowDown;
  faCheckToSlot = faCheckToSlot;
  faCircleXmark = faCircleXmark;
  faRotate = faRotate;
  faPeopleArrowsLeftRight = faPeopleArrowsLeftRight;
  switchTranspose: boolean = false;
  valorabuscartranspose: string = '';
  newTranspose: any = [];
  allUsers: any = [];
  //DatesOnCut
  dates: any = [];
  dateSelect: any;
  //ComponentsView
  view: number = 0;
  //Actas
  actas: any;
  Vista: boolean = false;
  //MyRol
  myRol: string = '';
  id: string = '';
  valorabuscar: string = '';
  //TableResult
  reqResult = {} as Respuesta | undefined;

  //NewRequest
  ActoRegistral: string = 'ACTA REGISTRAL';
  MetodoBusqueda: string = 'MÉTODO DE BUSQUEDA';
  Estado: string = '';
  DatoEnviar: string = '';
  Lock: boolean = false;
  ModalReq: boolean = false;
  CanInput: boolean = false;
  Table_Vista: boolean = false;
  Table_Result: any = [];
  constructor(
    private router: Router,
    private reqService: RequestsService,
    private auth: AuthService,
    private actasservice: ActasService
  ) {}

  ngOnInit(): void {
    // document.getElementById("typeReq")?.setAttribute("*ngIf", "false");
    this.GetMyData();
    closeAlert();
  }

  switcheableView(i: number) {
    this.reqResult = {} as Respuesta;
    //1 = Solicitudes
    //2 = Nueva
    switch (i) {
      case 1:
        this.getDates();
        this.Vista_actas();
        break;
      case 2:
        this.getServices();
        this.Vista_actas();
        break;
      default:
        break;
    }
  }

  Modal_Unload() {
    loader();

    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Apartado en Mantenimiento',
      showConfirmButton: false,
      timer: 1500,
    });
  }
  getServices() {
    this.view = 2;
  }

  GetMyData() {
    this.auth.GetMyData.subscribe((data) => {
      this.myRol = data.rol;
      this.id = data.id.toString();
    });
  }

  // Dates
  getDates() {
    this.reqService.getMyDatesActasRequest().subscribe(
      (data: any) => {
        this.view = 1;
        this.dates = data;
        this.selectDate(data[0].deadline);
        //console.log(data[0].deadline);
      },
      (err: any) => {
        //No Identificated!
        console.log(err.error.message);
      }
    );
  }

  selectDate(date: any) {
    this.dateSelect = date;
    this.reqService.getAllActasRequest(this.dateSelect).subscribe(
      (data: any) => {
        this.actas = [];
        for (let i = 0; i < data.length; i++) {
          let metadata = '';
          switch (data[i].search) {
            case 'CURP':
              metadata =
                'TIPO: ' +
                data[i].type.toUpperCase() +
                '\nCURP: ' +
                data[i].curp +
                '\nESTADO: ' +
                data[i].estado;
              break;
            case 'Cadena Digital':
              metadata = 'CADENA: ' + data[i].metadata.cadena;
              break;
            case 'Datos Personales':
              if (data[i].metadata.sexo != undefined) {
                metadata =
                  'TIPO: ' +
                  data[i].metadata.type +
                  '\nESTADO: ' +
                  data[i].metadata.state +
                  '\nNOMBRES: ' +
                  data[i].metadata.nombre +
                  '\n1er APELLIDO: ' +
                  data[i].metadata.primerapellido +
                  '\n2do APELLIDO: ' +
                  data[i].metadata.segundoapelido +
                  '\nSEXO: ' +
                  data[i].metadata.sexo +
                  '\nFECHA NAC.: ' +
                  data[i].metadata.fecnac;
              } else {
                metadata =
                  'TIPO: ' +
                  data[i].metadata.type +
                  '\nESTADO: ' +
                  data[i].metadata.state +
                  '\nNOMBRES (1): ' +
                  data[i].metadata.nombre +
                  '\n1er APELLIDO (1): ' +
                  data[i].metadata.primerapellido +
                  '\n2do APELLIDO (1): ' +
                  data[i].metadata.segundoapelido +
                  '\nNOMBRES (2): ' +
                  data[i].metadata.snombre +
                  '\n1er APELLIDO (2): ' +
                  data[i].metadata.sprimerapellido +
                  '\n2do APELLIDO (2): ' +
                  data[i].metadata.ssegundoapellido;
              }
              break;
            case 'Datos del Registro Civil':
              break;
            default:
              metadata = '';
              break;
          }

          this.actas.push({
            nm: i + 1,
            id: data[i].id,
            type: data[i].type,
            metadata: metadata,
            createdAt: data[i].createdAt,
            send: data[i].send,
            comments: data[i].comments,
            url: data[i].curp ? `${data[i].curp}.pdf` : null,
            transposeId: data[i].transposeId,
            downloaded: data[i].downloaded,
          });
        }
      },
      (err: any) => {
        console.log(err.error.message);
      }
    );
  }

  SetState() {
    let res = this.DatoEnviar.charAt(11) + this.DatoEnviar.charAt(12);
    switch (res) {
      case 'AS': {
        this.Estado = 'AGUASCALIENTES';
        break;
      }
      case 'BC': {
        this.Estado = 'BAJA CALIFORNIA';
        break;
      }
      case 'BS': {
        this.Estado = 'BAJA CALIFORNIA SUR';
        break;
      }
      case 'CC': {
        this.Estado = 'CAMPECHE';
        break;
      }
      case 'CS': {
        this.Estado = 'CHIAPAS';
        break;
      }
      case 'CH': {
        this.Estado = 'CHIHUAHUA';
        break;
      }
      case 'DF': {
        this.Estado = 'DISTRITO FEDERAL';
        break;
      }
      case 'CL': {
        this.Estado = 'COAHUILA DE ZARAGOZA';
        break;
      }
      case 'CM': {
        this.Estado = 'COLIMA';
        break;
      }
      case 'DG': {
        this.Estado = 'DURANGO';
        break;
      }
      case 'GT': {
        this.Estado = 'GUANAJUATO';
        break;
      }
      case 'GR': {
        this.Estado = 'GUERRERO';
        break;
      }
      case 'HG': {
        this.Estado = 'HIDALGO';
        break;
      }
      case 'JC': {
        this.Estado = 'JALISCO';
        break;
      }
      case 'MC': {
        this.Estado = 'MEXICO';
        break;
      }
      case 'MN': {
        this.Estado = 'MICHOACAN';
        break;
      }
      case 'MS': {
        this.Estado = 'MORELOS';
        break;
      }
      case 'NT': {
        this.Estado = 'NAYARIT';
        break;
      }
      case 'NL': {
        this.Estado = 'NUEVO LEON';
        break;
      }
      case 'OC': {
        this.Estado = 'OAXACA';
        break;
      }
      case 'PL': {
        this.Estado = 'PUEBLA';
        break;
      }
      case 'QT': {
        this.Estado = 'QUERETARO';
        break;
      }
      case 'QR': {
        this.Estado = 'QUINTANA ROO';
        break;
      }
      case 'SP': {
        this.Estado = 'SAN LUIS POTOSI';
        break;
      }
      case 'SL': {
        this.Estado = 'SINALOA';
        break;
      }
      case 'SR': {
        this.Estado = 'SONORA';
        break;
      }
      case 'TC': {
        this.Estado = 'TABASCO';
        break;
      }
      case 'TS': {
        this.Estado = 'TAMAULIPAS';
        break;
      }
      case 'TL': {
        this.Estado = 'TLAXCALA';
        break;
      }
      case 'VZ': {
        this.Estado = 'VERACRUZ';
        break;
      }
      case 'YN': {
        this.Estado = 'YUCATAN';
        break;
      }
      case 'ZS': {
        this.Estado = 'ZACATECAS';
        break;
      }
      default: {
        this.Estado = 'NACIDO EN EL EXTRANJERO';
        break;
      }
    }
  }

  verifyCurp() {
    let iniciales =
      this.DatoEnviar.charAt(0) +
      this.DatoEnviar.charAt(1) +
      this.DatoEnviar.charAt(2) +
      this.DatoEnviar.charAt(3);
    let año =
      this.DatoEnviar.charAt(4) +
      this.DatoEnviar.charAt(5) +
      this.DatoEnviar.charAt(6) +
      this.DatoEnviar.charAt(7) +
      this.DatoEnviar.charAt(8) +
      this.DatoEnviar.charAt(9);
    let clave =
      this.DatoEnviar.charAt(10) +
      this.DatoEnviar.charAt(11) +
      this.DatoEnviar.charAt(12) +
      this.DatoEnviar.charAt(13) +
      this.DatoEnviar.charAt(14) +
      this.DatoEnviar.charAt(15);
    var hasNumber = /\d/;
    var hasString = /[A-Za-z]/;
    var hasAccent = /[À-ú]/;
    let one = hasNumber.test(iniciales);
    let two = hasString.test(año);
    let three = hasNumber.test(clave);
    let four = hasAccent.test(iniciales + clave);
    if (!one && !two && !three && !four) {
      return true;
    } else {
      return false;
    }
  }

  KeyupData() {
    switch (this.MetodoBusqueda) {
      case 'CADENA':
        if (this.DatoEnviar.length > 20) {
          this.Lock = false;
          this.DatoEnviar = this.DatoEnviar.slice(0, 20);
        } else if (this.DatoEnviar.length == 20) {
          this.Lock = true;
          document
            .getElementById('solicitarReq')
            ?.setAttribute('class', 'myButtonOn');
        } else {
          this.Lock = false;
          document
            .getElementById('solicitarReq')
            ?.setAttribute('class', 'myButtonOff');
        }
        break;
      case 'CURP':
        if (this.DatoEnviar.length > 18) {
          this.Lock = false;
          this.DatoEnviar = this.DatoEnviar.slice(0, 18);
        } else if (this.DatoEnviar.length == 18) {
          this.DatoEnviar = this.DatoEnviar.toUpperCase();
          this.SetState();

          if (this.verifyCurp() == false) {
            this.Lock = false;
            document
              .getElementById('solicitarReq')
              ?.setAttribute('class', 'myButtonOff');
            document
              .getElementById('alertState')
              ?.setAttribute(
                'style',
                'background-color: rgb(240, 125, 125); color:black;'
              );
            this.Estado = 'ERROR DE FORMATO';
          } else {
            this.Lock = true;
            document
              .getElementById('solicitarReq')
              ?.setAttribute('class', 'myButtonOn');
            document
              .getElementById('alertState')
              ?.setAttribute(
                'style',
                'background-color: rgb(158, 240, 125); color:black;'
              );
          }
        } else {
          this.Lock = false;
          document
            .getElementById('solicitarReq')
            ?.setAttribute('class', 'myButtonOff');
          document
            .getElementById('alertState')
            ?.setAttribute(
              'style',
              'background-color: rgb(255, 255, 255); color:black;'
            );
          this.Estado = 'SIN ENTIDAD';
        }
        break;
      default:
        break;
    }
  }

  SelectMetodoBusqueda(newValue: any) {
    this.CanInput = false;
    if (newValue != 'MÉTODO DE BUSQUEDA') {
      this.DatoEnviar = '';
      document
        .getElementsByName('ActoRegistral')[0]
        ?.removeAttribute('disabled');

      if (newValue == 'CADENA') {
        this.ActoRegistral = 'CADENA';
        this.CanInput = true;
        document
          .getElementsByName('ActoRegistral')[0]
          ?.setAttribute('disabled', '');
      } else if (newValue == 'CURP') {
        this.ActoRegistral = 'ACTA REGISTRAL';
        this.CanInput = false;
        document
          .getElementsByName('ActoRegistral')[0]
          ?.removeAttribute('disabled');
      }
    }
  }

  SelectActaRegistral(newValue: any) {
    if (newValue != 'ACTA REGISTRAL') {
      this.CanInput = true;
    }
  }

  Enviar_Nueva_Solicitud() {
    loader();
    this.ModalReq = false;
    this.Get_Table();
  }
  Get_Table() {
    this.Table_Vista = true;
    closeAlert();
  }

  EnviarSolicitud(preferences: Number) {
    this.ModalReq = false;

    if (
      (preferences == 2 && this.Estado == 'NACIDO EN EL EXTRANJERO') ||
      (preferences == 3 && this.Estado == 'NACIDO EN EL EXTRANJERO')
    ) {
      console.log('Error');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'NO APLICA PARA ACTAS DEL EXTRANJERO',
      });
    } else {
      let metadata = {};
      loader();
      if (this.MetodoBusqueda == 'CURP') {
        metadata = {
          type: this.ActoRegistral,
          state: this.Estado,
          curp: this.DatoEnviar,
        };

        this.reqService
          .SendARequest(
            this.ActoRegistral,
            this.MetodoBusqueda,
            this.DatoEnviar,
            this.Estado,
            preferences
          )
          .subscribe(
            (data: any) => {
              closeAlert();
              this.ActoRegistral = 'ACTA REGISTRAL';
              this.MetodoBusqueda = 'MÉTODO DE BUSQUEDA';
              this.DatoEnviar = '';
              this.Lock = false;
              this.CanInput = false;

              this.reqResult = data;
              document
                .getElementsByName('ActoRegistral')[0]
                ?.setAttribute('disabled', '');
              document
                .getElementById('solicitarReq')
                ?.setAttribute('class', 'myButtonOff');
            },
            (err: any) => {
              closeAlert();
              if (err.status == 404) {
                Swal.fire({
                  icon: 'error',
                  title: 'NO ENCONTRADO',
                  text: err.error.error ? err.error.error : 'Error interno',
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: err.error.message ? err.error.message : 'Error interno',
                });
              }
            }
          );
        
      }
      else if (this.MetodoBusqueda == 'CADENA') {
        metadata = { cadena: this.DatoEnviar };

       
        
        this.reqService
          .SendARequest(  "NACIMIENTO",
          this.MetodoBusqueda,
          this.DatoEnviar,
          this.Estado,
          preferences)
          .subscribe(
            (data: any) => {
              closeAlert();
              this.ActoRegistral = 'ACTA REGISTRAL';
              this.MetodoBusqueda = 'MÉTODO DE BUSQUEDA';
              this.DatoEnviar = '';
              this.CanInput = false;
              this.Lock = false;
              this.reqResult = data;
              document
                .getElementById('solicitarReq')
                ?.setAttribute('class', 'myButtonOff');
              document
                .getElementsByName('ActoRegistral')[0]
                ?.setAttribute('disabled', '');
            },
            (err: any) => {
              this.auth.Unauth();
              console.log(err);
            }
          );
      }
    }
     
  }
  Vista_actas() {
    this.Vista = true;
  }
  close_actas() {
    this.Vista = false;
    this.Table_Result = [];
    this._tableResult = '';
    this.switchTranspose = false;
    this.newTranspose = [];
    this.allUsers = [];
    this.valorabuscartranspose = '';
    this.actas = [];
  }

  DescargarActa(folio: string, curp: string) {
    loader();
    this.reqService.DownloadFolio(folio).subscribe((data: any) => {
      var blob = this.b64toBlob(data?.b64, 'application/pdf');

      closeAlert();
      let a = document.createElement('a');
      var url = URL.createObjectURL(blob);
      a.href = url;
      a.download = String(curp);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    });
  }

  b64toBlob(b64Data: any, contentType: any) {
    contentType = contentType || '';
    let sliceSize = 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  Solicitar() {
    if (this.Lock) {
      this.ModalReq = true;
    }
  }

  DownloadActa(id: any, name: any) {
    if (name != null) {
      this.reqService.DownloadActa(id).subscribe((data) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(data);
        a.href = objectUrl;
        a.download = name;
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.reqResult = {} as Respuesta;
      });
    }
  }

  obtainAllUsers(id: any) {
    //getuser
    this.switchTranspose = !this.switchTranspose;

    if (this.switchTranspose == true) {
      this.newTranspose = id;

      this.actasservice.getuser().subscribe((data: any) => {
        this.allUsers = data;
      });
    } else {
      this.allUsers = [];
    }
  }

  reAsignarActas(idProvider: any) {
    this.switchTranspose = false;
    this.actasservice.reAsignarActaID(this.newTranspose, idProvider).subscribe(
      (data: any) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Re-Asignado',
          showConfirmButton: false,
          timer: 1500,
        });

        this.close_actas();
      },
      (error: any) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Contacte al equipo de soporte',
          showConfirmButton: false,
          timer: 1500,
        });
        this.close_actas();
      }
    );
  }

  //RECARGAMOS LA PAGINA POR SI MISMA
  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
