import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AjoutVentesService {

  private apiUrl = 'http://localhost:3000/ajout-vente';

  constructor(private http: HttpClient) {}

  ajouterVente(objet: FormData) {
    return this.http.post(this.apiUrl, objet);
  }

  
}

