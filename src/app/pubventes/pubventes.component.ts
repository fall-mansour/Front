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
  searchTerm = '';
  categorieSelectionnee: string = 'toutes';
  statutUtilisateur: string = '';

  // === Modale / Carrousel
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

  // ===== CHARGEMENT =====
  chargerVentes(): void {
    this.loading = true;
    const cat = this.categorieSelectionnee === 'toutes' ? '' : this.categorieSelectionnee;

    this.ventesService.getVentes(cat).subscribe({
      next: data => {
        // Forcer les images à string pour TS
        this.ventes = data.map(v => ({
          ...v,
          image: v.image ? `${environment.apiUrl.replace('/api','')}/uploads/${v.image}` : '',
          image1: v.image1 ? `${environment.apiUrl.replace('/api','')}/uploads/${v.image1}` : '',
          image2: v.image2 ? `${environment.apiUrl.replace('/api','')}/uploads/${v.image2}` : ''
        }));
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.errorMsg = 'Erreur lors du chargement des ventes.';
        this.loading = false;
      }
    });
  }

  chargerCategories(): void {
    this.ventesService.getCategories().subscribe({
      next: cats => this.categories = cats,
      error: err => console.error('Erreur chargement catégories', err)
    });
  }

  filtrerCategorie(categorie: string): void {
    this.categorieSelectionnee = categorie;
    this.chargerVentes();
  }

  getObjetsFiltres(): ObjetVente[] {
    return this.ventes.filter(obj => !this.searchTerm || obj.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  redirigercompte(): void {
    this.router.navigate(['/infoscompte']);
  }

  // === MODALE / CARROUSEL ===
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
    if (this.images.length <= 1) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.updateSelectedImage();
  }

  nextImage(): void {
    if (this.images.length <= 1) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.updateSelectedImage();
  }

  updateSelectedImage(): void {
    if (!this.images.length) return;
    this.selectedImage = this.sanitizer.bypassSecurityTrustUrl(this.images[this.currentImageIndex]);
  }
}
