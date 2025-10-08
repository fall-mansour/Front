import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environnement';// ← import correct

@Injectable({
  providedIn: 'root'
})
export class InfosService {
  private apiUrl = `${environment.apiUrl}/infos`; // ← route backend /infos

  constructor(private http: HttpClient) {}

  // Récupérer les infos de l'utilisateur par email
  getInfos(mail: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${mail}`);
  }

  // Mettre à jour les infos de l'utilisateur
  updateInfos(mail: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${mail}`, data);
  }
}
