import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environnement';

export interface ObjetAide {
  id: number;
  description: string;
  quantite: number;
  image: string;
  image1?: string;
  image2?: string;
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

  /** Transforme un nom de fichier en URL complète */
  private getImageUrl(imageName?: string): string {
    if (!imageName) return '';
    return imageName.startsWith('http') 
      ? imageName 
      : `${environment.apiUrl}/uploads/${imageName}`;
  }

  getAides(categorie: string = 'toutes'): Observable<ObjetAide[]> {
    let params = new HttpParams();
    if (categorie && categorie !== 'toutes') {
      params = params.set('categorie', categorie);
    }
    return this.http.get<ObjetAide[]>(this.apiUrl, { params }).pipe(
      map(aides => aides.map(a => ({
        ...a,
        image: this.getImageUrl(a.image),
        image1: this.getImageUrl(a.image1),
        image2: this.getImageUrl(a.image2)
      })))
    );
  }

  deleteObjetAide(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAideById(id: number): Observable<ObjetAide> {
    return this.http.get<ObjetAide>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }
}
