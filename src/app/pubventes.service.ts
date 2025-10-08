import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environnement';

export interface ObjetVente {
  id: number;
  description: string;
  quantite: number;
  prix: number;
  image: string;   // image principale
  image1?: string; // image secondaire 1
  image2?: string; // image secondaire 2
  created_at: string;
  vendeurNom: string;
  vendeurNumero: string;
  adresse: string;
  categorie: string;
}

@Injectable({
  providedIn: 'root'
})
export class PubventesService {
  private apiUrl = environment.apiUrl + '/pubventes';

  constructor(private http: HttpClient) {}

  getVentes(categorie: string = 'toutes'): Observable<ObjetVente[]> {
    return this.http.get<ObjetVente[]>(`${this.apiUrl}?categorie=${categorie}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }
}
