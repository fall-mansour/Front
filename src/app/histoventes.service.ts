import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environnement';

export interface ObjetVente {
  id: number;
  description: string;
  quantite: number;
  prix: number;
  image: string;
  created_at: string;
  nom: string;
  telephone: string;
  adresse: string;
  categorie?: string; // optionnel
}

@Injectable({
  providedIn: 'root'
})
export class HistoventesService {
  private apiUrl = environment.apiUrl + '/histoventes';

  constructor(private http: HttpClient) {}

  /** Transforme un nom de fichier en URL complète */
  private getImageUrl(imageName?: string): string {
    if (!imageName) return '';
    return imageName.startsWith('http')
      ? imageName
      : `${environment.apiUrl}/uploads/${imageName}`;
  }

  /** Récupérer toutes les ventes d’un utilisateur */
  getVentesByUser(utilisateurId: number): Observable<ObjetVente[]> {
    return this.http.get<ObjetVente[]>(`${this.apiUrl}/utilisateur/${utilisateurId}`)
      .pipe(
        map(ventes => ventes.map(v => ({
          ...v,
          image: this.getImageUrl(v.image)
        })))
      );
  }

  /** Supprimer une vente par son ID */
  deleteObjetVente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
