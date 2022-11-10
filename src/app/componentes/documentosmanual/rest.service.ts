import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { Token } from '../login/token.model';
const api = "https://actasalinstante.com:3030";
@Injectable({
  providedIn: 'root',
})
export class RestService {
  constructor(private http: HttpClient) {
  }
  sendPost(body: FormData): Observable<any> {
    var i = CryptoJS.AES.decrypt(localStorage.getItem("привіт") || '{}', "привіт");
    var token: any = i.toString(CryptoJS.enc.Utf8);
    var parteuno = token.slice(1);
    var final = parteuno.slice(0, -1);
    const headers = new HttpHeaders({ 'x-access-token': final! });
    return this.http.post(api+`/api/actas/load`, body, { headers })
  }
  getdoc(body: FormData): Observable<any> {
    const token = localStorage.getItem("привіт");
    const headers = new HttpHeaders({ 'x-access-token': token! });
    return this.http.post(api+`/api/actas/load`, body, { headers })
  }
  getuser(): Observable<any> {
    return this.http.get(api+'/api/user/getFull/')
  }
  getciber(): Observable<any> {
    return this.http.get(api+'/api/clients/getAll');
  }
  getprecioyasesor(tipo: any, estado: any, id: any) {
    return this.http.put(api + '/api/clients/getMyData/' + id, { "tipo": tipo, "estado": estado })
  }

  getidsupervisor(id: any) {
    return this.http.get(api+'/api/user/getOne/' + id);
  }

  enviarcta(ciberseleccionado: any,  tipo: any, curp: any, estado: any, nombre: any, nombredearchivo:any): Observable<any> {
    var i = CryptoJS.AES.decrypt(localStorage.getItem("привіт") || '{}', "привіт");
    var token: any = i.toString(CryptoJS.enc.Utf8);
    var parteuno = token.slice(1);
    var final = parteuno.slice(0, -1);
    let tokenfinal: string = final;
    const headers = new HttpHeaders({ 'x-access-token': tokenfinal! });
    return this.http.post(api+'/api/actas/reg/new/', { level0: ciberseleccionado, document: tipo, state: estado, dataset: curp, nameinside: nombre,  namefile:nombredearchivo }, { headers });
  }
  //Corte de historial
  getcorte(id: any): Observable<any> {
    return this.http.get(api+'/api/getMyCorteId/' + id)
  }

  getMyDocumentsLoaded(id: any) {
    return this.http.get(api + '/api/actas/getMyDocuments/' + id);
  }

  deleteActa(id: any) {
    var i = CryptoJS.AES.decrypt(localStorage.getItem("привіт") || '{}', "привіт");
    var token: any = i.toString(CryptoJS.enc.Utf8);
    var parteuno = token.slice(1);
    var final = parteuno.slice(0, -1);
    let tokenfinal: string = final;
    const headers = new HttpHeaders({ 'x-access-token': tokenfinal! });
    return this.http.delete(api + '/api/actas/deleteActa/' + id);
  }
  deleteuser(id: any): Observable<any> {
    return this.http.get(api+'/api/user/delete/' + id)
  }
  editPrecior(id: any, precios: any): Observable<any> {
    return this.http.put(api+'/api/user/editPrice/' + id, { precios: precios })
  }
  GetActasNumber(id: any): Observable<any> {
    return this.http.get(api+'/api/actas/CountForEnterprise/' + id)
  }

  Getpapelera( ): Observable<any> {
    var i = CryptoJS.AES.decrypt(localStorage.getItem("привіт") || '{}', "привіт");
    var token: any = i.toString(CryptoJS.enc.Utf8);
    var parteuno = token.slice(1);
    var final = parteuno.slice(0, -1);
    const headers = new HttpHeaders({ 'x-access-token': final! });
    return this.http.get(api+'/api/actas/Trash/' , { headers })
  }
  

} 