import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environnement';

export interface ObjetAide {
  id: number;
  description: string;
  quantite: number;
  image: string;
  created_at: string;
  nom: string;
  telephone: string;
  adresse: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistoaidesService {
  private apiUrl = environment.apiUrl + '/histoaides';

  constructor(private http: HttpClient) {}

  getAidesByUser(userId: number): Observable<ObjetAide[]> {
    return this.http.get<ObjetAide[]>(`${this.apiUrl}?userId=${userId}`);
  }

  supprimerAide(aideId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${aideId}`);
  }
}
