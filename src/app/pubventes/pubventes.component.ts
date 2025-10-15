import { Component, OnInit } from '@angular/core';
import { PubventesService, ObjetVente } from '../pubventes.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../environnement';

@Component({
  selector: 'app-pubventes',
  standalone: true,
  imports: [FormsModule, NgFor, DatePipe, NgIf, CommonModule],
  templateUrl: './pubventes.component.html',
  styleUrls: ['./pubventes.component.scss'],
})
export class PubventesComponent implements OnInit {
  ventes: ObjetVente[] = [];
  categories: string[] = [];
  loading = true;
  errorMsg = '';
  searchTerm: string = '';
  categorieSelectionnee: string = 'toutes';
  statutUtilisateur: string = '';

  // ===== Modale & carrousel =====
  showModal = false;
  images: string[] = [];
  currentImageIndex: number = 0;
  selectedImage!: SafeUrl;
  selectedObjet!: ObjetVente;

  constructor(
    private ventesService: PubventesService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || 'null');
    this.statutUtilisateur = utilisateur?.statut?.toLowerCase() || '';

    this.chargerCategories();
    this.chargerVentes();
  }

  // ======= CHARGEMENT =======
  chargerVentes(): void {
    this.loading = true;
    const cat = this.categorieSelectionnee === 'toutes' ? '' : this.categorieSelectionnee;
    this.ventesService.getVentes(cat).subscribe({
      next: data => {
        this.ventes = data;
        this.loading = false;
      },
      error: err => {
        this.errorMsg = 'Erreur lors du chargement des ventes.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  chargerCategories(): void {
    this.ventesService.getCategories().subscribe({
      next: cats => this.categories = cats,
      error: err => console.error('Erreur chargement catégories', err)
    });
  }

  // ======= FILTRAGE =======
  filtrerCategorie(categorie: string): void {
    this.categorieSelectionnee = categorie;
    this.chargerVentes();
  }

  getObjetsFiltres(): ObjetVente[] {
    return this.ventes.filter(obj => {
      const matchRecherche = !this.searchTerm || obj.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchRecherche;
    });
  }

  // ======= REDIRECTION =======
  redirigercompte(): void {
    this.router.navigate(['/infoscompte']);
  }

  // ======= MODALE CARROUSEL =======
 ouvrirDetails(obj: ObjetVente): void {
  this.selectedObjet = obj;
  this.images = [];

  if (obj.image) this.images.push(obj.image);
  if (obj.image1 && obj.image1.trim() !== '') this.images.push(obj.image1);
  if (obj.image2 && obj.image2.trim() !== '') this.images.push(obj.image2);

  this.currentImageIndex = 0;
  this.updateSelectedImage();
  this.showModal = true;
}


  fermerModale(): void {
    this.showModal = false;
  }
prevImage(): void {
  if (this.images.length <= 1) return; // ne rien faire si 1 seule image
  this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  this.updateSelectedImage();
}

nextImage(): void {
  if (this.images.length <= 1) return; // ne rien faire si 1 seule image
  this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  this.updateSelectedImage();
}


   updateSelectedImage(): void {
    this.selectedImage = this.sanitizer.bypassSecurityTrustUrl(
      'http://localhost:3000/uploads/' + this.images[this.currentImageIndex]
    );
  }
}
