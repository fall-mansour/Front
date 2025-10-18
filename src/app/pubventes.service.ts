import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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

  // Méthode pour transformer le nom de fichier en URL complète
  private getImageUrl(imageName?: string): string | null {
    if (!imageName) return null;
    return imageName.startsWith('http') 
      ? imageName 
      : `${environment.apiUrl}/uploads/${imageName}`;
  }

  getVentes(categorie: string = 'toutes'): Observable<ObjetVente[]> {
    return this.http.get<ObjetVente[]>(`${this.apiUrl}?categorie=${categorie}`)
      .pipe(
        map(ventes => 
          ventes.map(v => ({
            ...v,
            image: this.getImageUrl(v.image),
            image1: this.getImageUrl(v.image1),
            image2: this.getImageUrl(v.image2)
          }))
        )
      );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }
}
