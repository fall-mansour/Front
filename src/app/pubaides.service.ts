import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environnement';

export interface ObjetAide {
  id: number;
  description: string;
  quantite: number;
  image: string;
  image1:string,
  image2:string,
  created_at: string;
  categorie: string;
  utilisateur_nom: string;
  utilisateur_telephone: string;
  utilisateur_adresse: string;
}

@Injectable({
  providedIn: 'root'
})
export class PubaidesService {
  private apiUrl = environment.apiUrl + '/pubaides';

  constructor(private http: HttpClient) {}

  /** Récupérer tous les objets aides, optionnellement filtrés par catégorie */
  getAides(categorie: string = 'toutes'): Observable<ObjetAide[]> {
    let params = new HttpParams();
    if (categorie && categorie !== 'toutes') {
      params = params.set('categorie', categorie);
    }
    return this.http.get<ObjetAide[]>(this.apiUrl, { params });
  }

  /** Supprimer un objet d’aide par son ID */
  deleteObjetAide(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /** Récupérer un objet d’aide spécifique par son ID */
  getAideById(id: number): Observable<ObjetAide> {
    return this.http.get<ObjetAide>(`${this.apiUrl}/${id}`);
  }

  /** Récupérer toutes les catégories disponibles */
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }
}
