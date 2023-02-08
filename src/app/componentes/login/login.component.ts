import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from "../../servicios/login.service";
import * as CryptoJS from 'crypto-js';
import { Token } from './token.model';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';
import { ThisReceiver } from '@angular/compiler';

declare function swalError(mensaje: any): any;
declare function validateLogin(): any;



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: string = "";
  contrasena: string = "";
  etextoncriptar: string = "";
  constructor(private router: Router, private login: LoginService) { }


  ngOnInit(): void {
  }

 


}
