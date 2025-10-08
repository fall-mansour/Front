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
  prenom: string;
  telephone: string;
  adresse: string;
  categorie: string;



}

@Injectable({
  providedIn: 'root'
})
export class ObjetsaidesService {
  private apiUrl = environment.apiUrl + '/objetsaides';

  constructor(private http: HttpClient) {}

  getObjetsAides(): Observable<ObjetAide[]> {
    return this.http.get<ObjetAide[]>(this.apiUrl);
  }
}
