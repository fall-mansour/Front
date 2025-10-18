import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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

  /** Transforme un nom de fichier en URL complète */
  private getImageUrl(imageName?: string): string {
    if (!imageName) return '';
    return imageName.startsWith('http')
      ? imageName
      : `${environment.apiUrl}/uploads/${imageName}`;
  }

  /** Récupérer toutes les aides d’un utilisateur */
  getAidesByUser(userId: number): Observable<ObjetAide[]> {
    return this.http.get<ObjetAide[]>(`${this.apiUrl}?userId=${userId}`)
      .pipe(
        map(aides => aides.map(a => ({
          ...a,
          image: this.getImageUrl(a.image)
        })))
      );
  }

  /** Supprimer une aide par son ID */
  supprimerAide(aideId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${aideId}`);
  }
}
