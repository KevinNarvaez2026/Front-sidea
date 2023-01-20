import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LocalstorageService } from 'src/app/servicios/localstorage/localstorage.service';
import * as CryptoJS from 'crypto-js';
const api = "https://actasalinstante.com:3030";


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private httpClient: HttpClient, private localStorageService: LocalstorageService) { }


  getAllUsers(id:any){
    return this.httpClient.get(api+'/api/user/getMyClients/'+id);
  }

  getAllProviders(){
    let token = this.localStorageService.TokenDesencrypt();
    const headers = new HttpHeaders({ 'x-access-token': token! });
    return this.httpClient.get(api+'/api/user/mySuperviser/',{headers});
  }

  getmydata(): Observable<any>{
    let token = this.localStorageService.TokenDesencrypt();
    const headers = new HttpHeaders({ 'x-access-token': token! });
    return this.httpClient.get(api+'/api/user/myData/', {headers});
  }

  getAllClients(username:any){
    return this.httpClient.get(api+'/api/getMyCorte/' + username);
  }
  

}
