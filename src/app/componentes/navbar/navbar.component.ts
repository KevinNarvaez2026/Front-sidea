import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';
import { SocketService } from '../../servicios/socket/socket.service';
import { LocalstorageService } from 'src/app/services/manage/localstorage.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faHomeUser } from '@fortawesome/free-solid-svg-icons';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { faPersonWalkingArrowRight } from '@fortawesome/free-solid-svg-icons';
//Models
import { myData } from 'src/app/models/myData.model';
import { ActasService } from 'src/app/servicios/Actas/actas.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdminService } from 'src/app/servicios/admin.service';
declare function loader(): any;
declare function closeAlert(): any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  //Observables
  myData$: Observable<myData>;

  //Iconos
  faFile = faFile;
  faGear = faGear;
  faBook = faBook;
  faBars = faBars;
  faHomeUser = faHomeUser;
  faSackDollar = faSackDollar;
  faAddressCard = faAddressCard;
  faPowerOff = faPowerOff;
  faPersonWalkingArrowRight = faPersonWalkingArrowRight;
  isImageLoading: boolean = false;
  usuario: any = '';
  myRol: any = '';
  imageToShow: any;
  //Selectable
  option: Number = 0;
  fileToUpload: any;
  Imagenes: any;

  ///////

  uploadedImage: any = File;
  dbImage: any;
  postResponse: any;
  successResponse: any = String;
  image: any;
  showEditServicesModal: boolean = false;
  public onImageUpload($event: any) {
    this.uploadedImage = $event.target.files[0];
  }
  constructor(
    private local: LocalstorageService,
    private auth: AuthService,
    private router: Router,
    private acta: ActasService,
    private httpClient: HttpClient,
    private localStorage: LocalstorageService
  ) {
    this.myData$ = auth.GetMyData;
  }

  ngOnInit(): void {
    this.GetMyUser();
    this.getImageFromService();
    // try{
    //   this.option = Number(localStorage.getItem("aych24sdTi"));
    // }
    // catch{
    //   this.option = 0;
    // }
  }
  //RECARGAMOS EL COMPONENTE POR SI MISMO
  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  displayStyle = 'none';

  openPopup() {
    this.displayStyle = 'block';
  }
  closePopup() {
    closeAlert();
    this.displayStyle = 'none';
  
     this.reloadCurrentRoute();
  }
  imageUploadAction() {
    if (this.uploadedImage == null) {
      this.reloadCurrentRoute();
    } else {
      loader();
      var token = this.localStorage.TokenDesencrypt();
      const headers = new HttpHeaders({ 'x-access-token': token! });
      const imageFormData = new FormData();
      imageFormData.append(
        'avatar',
        this.uploadedImage,
        this.uploadedImage.name
      );

      this.httpClient
        .post(
          'https://actasalinstante.com:3030/api/user/avatar/up/',
          imageFormData,
          { observe: 'response', headers }
        )
        .subscribe((response) => {
          if (response.status === 201) {
            this.postResponse = response;
            this.successResponse = this.postResponse.body.message;
            console.log(response);

            closeAlert();
            this.reloadCurrentRoute();
          } else {
            this.successResponse = 'Image not uploaded due to some error!';
          }
        });
    }
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

  getImageFromService() {
    this.isImageLoading = true;
    this.acta.getImage().subscribe(
      (data) => {
        this.createImageFromBlob(data);
        this.isImageLoading = false;
      },
      (error) => {
        this.isImageLoading = false;
        console.log(error);
      }
    );
  }

  GetMyUser() {
    this.auth.getUserInfo().subscribe(
      (data) => {
        this.auth.SaveMyData = data;
        this.usuario = data.username;
        this.myRol = data.rol;
        document
          .getElementById('loaderPage')
          ?.setAttribute('style', 'display: none;');
      },
      (err) => {
        this.local.removeAll();
        this.router.navigateByUrl('/');
      }
    );
  }

  SelectOption(option: number) {
    this.option = option;
    if (option == 6) {
      this.local.removeAll();
      this.router.navigateByUrl('/');
    }
    // localStorage.setItem("aych24sdTi", option.toString());
  }
}
