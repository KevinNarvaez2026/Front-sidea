import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalstorageService } from 'src/app/servicios/localstorage/localstorage.service';
const api = "https://actasalinstante.com:3030"
@Injectable({
  providedIn: 'root'
})
export class PerfileditService {

  data: any = [];
  constructor(private http: HttpClient,private localStorageService: LocalstorageService) { }

  set(user: any) {
    this.data = user;
  }

  get() {
    return this.data;
  }
  editprecios(id: any, data:any){
    let token = this.localStorageService.TokenDesencrypt();
    const headers = new HttpHeaders({ 'x-access-token': token! });
    return this.http.put(api + '/api/user/update/' + id,  data ,{headers});
    

  }
}
