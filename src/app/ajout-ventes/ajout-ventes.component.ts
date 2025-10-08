import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environnement'; // <-- ajouté

@Component({
  selector: 'app-ajout-ventes',
  templateUrl: './ajout-ventes.component.html',
  styleUrls: ['./ajout-ventes.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class AjoutVentesComponent {
  description = '';
  quantite: number | null = null;
  prix: number | null = null;
  categorie = '';

  image: File | null = null;
  image1: File | null = null;
  image2: File | null = null;

  messageSuccess = '';
  messageErreur = '';
  isLoading = false;

  constructor(private http: HttpClient, private router: Router) {}

  onFileChange(event: any, field: string) {
    if (event.target.files && event.target.files.length > 0) {
      if (field === 'image') this.image = event.target.files[0];
      if (field === 'image1') this.image1 = event.target.files[0];
      if (field === 'image2') this.image2 = event.target.files[0];
    }
  }

  ajouterVente() {
    this.messageSuccess = '';
    this.messageErreur = '';
    this.isLoading = true;

    const utilisateurStr = localStorage.getItem('utilisateur');
    if (!utilisateurStr) {
      alert('⚠️ Utilisateur non connecté');
      this.isLoading = false;
      return;
    }

    const utilisateur = JSON.parse(utilisateurStr);

    if (!this.description || !this.quantite || !this.prix || !this.image || !this.categorie) {
      alert('⚠️ Les champs obligatoires doivent être remplis');
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('description', this.description);
    formData.append('quantite', String(this.quantite));
    formData.append('prix', String(this.prix));
    formData.append('categorie', this.categorie);
    formData.append('utilisateur_id', String(utilisateur.id));

    formData.append('image', this.image);
    if (this.image1) formData.append('image1', this.image1);
    if (this.image2) formData.append('image2', this.image2);

    this.http.post(`${environment.apiUrl}/ventes/ajout-vente`, formData)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.messageSuccess = '✅ Vente ajoutée avec succès !';
          console.log('Vente ajoutée', res);

          setTimeout(() => {
            this.router.navigate(['/pubventes']);
          }, 1500);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Erreur :', err);
          this.messageErreur = err.error?.message || 'Erreur lors de l’ajout';
        }
      });
  }
}
