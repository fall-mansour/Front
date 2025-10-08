import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ajout-aides',
  templateUrl: './ajout-aides.component.html',
  styleUrls: ['./ajout-aides.component.scss'],
  standalone: true,
  imports: [FormsModule,NgIf]
})
export class AjoutAidesComponent implements OnInit {
  description = '';
  quantite: number | null = null;
  categorie = '';
  categories: string[] = [];
  utilisateur_id: number = 0;

  // 3 fichiers images
  image!: File;
  image1!: File;
  image2!: File;
  messageSuccess = '';
  messageErreur = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const utilisateurStr = localStorage.getItem('utilisateur');
    if (!utilisateurStr) {
      alert('Veuillez vous connecter avant d’ajouter un objet');
      return;
    }
    const utilisateur = JSON.parse(utilisateurStr);
    this.utilisateur_id = utilisateur.id;

    // Charger les catégories depuis le backend
    this.http.get<string[]>('http://localhost:3000/api/pubaides/categories')
      .subscribe({
        next: (cats) => this.categories = cats,
        error: (err) => console.error('Erreur chargement catégories', err)
      });
  }

  onImageChange(event: any, field: string) {
    const file = event.target.files[0];
    if (!file) return;

    if (field === 'image') this.image = file;
    else if (field === 'image1') this.image1 = file;
    else if (field === 'image2') this.image2 = file;
  }

  ajouterAide() {
    if (!this.description || !this.quantite || !this.categorie) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const formData = new FormData();
    formData.append('description', this.description);
    formData.append('quantite', String(this.quantite));
    formData.append('categorie', this.categorie);
    formData.append('utilisateur_id', String(this.utilisateur_id));

    if (this.image) formData.append('image', this.image);
    if (this.image1) formData.append('image1', this.image1);
    if (this.image2) formData.append('image2', this.image2);

    this.http.post('http://localhost:3000/api/pubaides', formData)
      .subscribe({
        next: (res) => {
          console.log('✅ Aide ajoutée', res);
          alert('Aide ajoutée avec succès');
          setTimeout(() => this.router.navigate(['/pubaides']), 1000);
        },
        error: (err) => {
          console.error('❌ Erreur :', err);
          alert(err.error?.message || 'Erreur lors de l’ajout');
        }
      });
  }
}
