import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalstorageService } from '../manage/localstorage.service';

const urlApi = 'https://actasalinstante.com:3030';
const apiServices = 'http://187.135.142.238:3030';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  constructor(private http: HttpClient, private local: LocalstorageService) {}

  //ACTAS
  getMyDatesActasRequest() {
    let token = this.local.TokenDesencrypt();
    const headers = new HttpHeaders({ 'x-access-token': token! });
    return this.http.get(urlApi + '/api/requests/dates/', { headers });
  }

  getAllActasRequest(date:any) {
    let token = this.local.TokenDesencrypt();
    const headers = new HttpHeaders({ 'x-access-token': token! });
    return this.http.get(urlApi + '/api/get/myRequests/'+date,  {
      headers,
    });
  }

  SendARequest(
    type: any,
    search: any,
    data: any,
    estado: any,
    preferences: any
  ) {
    let token = this.local.TokenDesencrypt();
    const headers = new HttpHeaders({ 'x-access-token': token! });
    return this.http.post<any>(
      urlApi + '/api/services/actas/new/',
      { type, search, data, estado, preferences },
      { headers }
    );
  }

  DownloadFolio(folio: string) {
    let token = this.local.TokenDesencrypt();
    const headers = new HttpHeaders({ 'x-access-token': token! });

    return this.http.get(urlApi + '/api/services/actas/download/' + folio, {
      headers,
    });
  }

  DownloadActa(id: any) {
    return this.http.get(urlApi + '/api/actas/requests/getMyActa/' + id, {
      responseType: 'blob',
    });
  }

  //RFCs
  SendRFCRequest(search: any, data: any, clasification: any) {
    let token = this.local.TokenDesencrypt();
    const headers = new HttpHeaders({ 'x-access-token': token! });
    return this.http.post(
      urlApi + '/api/rfc/requests/news/',
      { search, data, clasification },
      { headers }
    );
  }

  getAllRFCRequest(date: any) {
    let token = this.local.TokenDesencrypt();
    const headers = new HttpHeaders({ 'x-access-token': token! });
    return this.http.get(urlApi + '/api/rfc/requests/myRequests/' + date, {
      headers,
    });
  }

  getMyDatesRFCRequest() {
    let token = this.local.TokenDesencrypt();
    const headers = new HttpHeaders({ 'x-access-token': token! });
    return this.http.get(urlApi + '/api/rfc/requests/myDates/', { headers });
  }

  DownloadRFC(id: any) {
    return this.http.get(urlApi + '/api/rfc/request/donwload/' + id, {
      responseType: 'blob',
    });
  }
}
