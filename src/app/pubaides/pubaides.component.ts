import { Component, OnInit } from '@angular/core';
import { PubaidesService, ObjetAide } from '../pubaides.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../environnement';


@Component({
  selector: 'app-pubaides',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, DatePipe, CommonModule],
  templateUrl: './pubaides.component.html',
  styleUrls: ['./pubaides.component.scss']
})
export class PubaidesComponent implements OnInit {
  aides: ObjetAide[] = [];
  categories: string[] = [];
  acquisitions: ObjetAide[] = [];

  // UI state
  loading = true;
  errorMsg = '';
  searchTerm = '';
  categorieSelectionnee: string = 'toutes';
  statutUtilisateur = '';

  // === Modale / Carousel ===
  showModal = false;
  images: string[] = [];
  currentImageIndex: number = 0;
  selectedImage!: SafeUrl;
  selectedObjet!: ObjetAide;

  constructor(
    private aidesService: PubaidesService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.initUtilisateur();
    this.chargerCategories();
    this.chargerAides();
  }

  /** Initialisation utilisateur et acquisitions */
  private initUtilisateur(): void {
    const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || 'null');
    this.statutUtilisateur = utilisateur?.statut?.toLowerCase() || '';

    const utilisateurId = utilisateur?.id;
    const acquisitionsStr = localStorage.getItem(`acquisitions_${utilisateurId}`);
    this.acquisitions = acquisitionsStr ? JSON.parse(acquisitionsStr) : [];
  }

  /** Charger la liste des aides */
  private chargerAides(): void {
    this.loading = true;
    const cat = this.categorieSelectionnee === 'toutes' ? '' : this.categorieSelectionnee;

    this.aidesService.getAides(cat).subscribe({
      next: data => {
        // Exclure les objets déjà acquis
        this.aides = data.filter(obj => !this.acquisitions.some(a => a.id === obj.id));
        this.loading = false;
      },
      error: err => {
        console.error('Erreur chargement aides:', err);
        this.errorMsg = 'Erreur lors du chargement des objets aides.';
        this.loading = false;
      }
    });
  }

  /** Charger les catégories disponibles */
  private chargerCategories(): void {
    this.aidesService.getCategories().subscribe({
      next: cats => (this.categories = cats),
      error: err => console.error('Erreur chargement catégories:', err)
    });
  }

  /** Filtrer les objets par recherche */
  getObjetsFiltres(): ObjetAide[] {
    return this.aides.filter(obj =>
      !this.searchTerm ||
      obj.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  /** Filtrage par catégorie */
  filtrerCategorie(categorie: string): void {
    this.categorieSelectionnee = categorie;
    this.chargerAides();
  }

  /** Redirection vers infos compte */
  redirigercompte(): void {
    this.router.navigate(['/infoscompte']);
  }

  // === MODALE / CAROUSEL ===
  ouvrirDetails(obj: ObjetAide): void {
    this.selectedObjet = obj;
    this.images = [];

    if (obj.image) this.images.push(obj.image);
    if (obj.image1 && obj.image1 !== obj.image) this.images.push(obj.image1);
    if (obj.image2 && obj.image2 !== obj.image) this.images.push(obj.image2);

    this.currentImageIndex = 0;
    this.updateSelectedImage();
    this.showModal = true;
  }

  fermerModale(): void {
    this.showModal = false;
  }

  prevImage(): void {
    if (!this.images.length) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.updateSelectedImage();
  }

  nextImage(): void {
    if (!this.images.length) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.updateSelectedImage();
  }

  updateSelectedImage(): void {
    this.selectedImage = this.sanitizer.bypassSecurityTrustUrl(
  `${environment.apiUrl.replace('/api','')}/uploads/${this.images[this.currentImageIndex]
    );
  }


}
