import { Component, OnInit } from '@angular/core';
import { HistoaidesService, ObjetAide } from '../histoaides.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environnement';


@Component({
  selector: 'app-histoaides',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './histoaides.component.html',
  styleUrls: ['./histoaides.component.scss'],
})
export class HistoaidesComponent implements OnInit {
  aides: ObjetAide[] = [];
  filteredAides: ObjetAide[] = [];
  searchTerm: string = '';
  loading = false;
  errorMsg: string | null = null;

  constructor(private histoaidesService: HistoaidesService) {}

  ngOnInit(): void {
    this.chargerAides();
  }

  chargerAides() {
    this.loading = true;
    this.errorMsg = null;

    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      this.loading = false;
      this.errorMsg = 'Vous devez être connecté pour voir vos dons.';
      return;
    }

    const userId = parseInt(userIdStr, 10);
    if (isNaN(userId)) {
      this.loading = false;
      this.errorMsg = 'ID utilisateur invalide.';
      return;
    }

    this.histoaidesService.getAidesByUser(userId).subscribe({
      next: (data: ObjetAide[]) => {
        this.loading = false;
        this.aides = data || [];
        this.filteredAides = [...this.aides]; // ⚡ Initialisation indispensable
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur chargement aides :', err);
        this.errorMsg = 'Impossible de charger l’historique des dons.';
      },
    });
  }

  filtrerAides() {
    const term = this.searchTerm?.trim().toLowerCase() || '';
    this.filteredAides = this.aides.filter(aide =>
      aide.description?.toLowerCase().includes(term)
    );
  }

  retirerAide(id: number) {
    if (!confirm('Voulez-vous vraiment retirer cette publication ?')) return;

    this.histoaidesService.supprimerAide(id).subscribe({
      next: () => {
        this.aides = this.aides.filter(a => a.id !== id);
        this.filtrerAides(); // ⚡ Met à jour filteredAides
        console.log('Don retiré avec succès');
      },
      error: (err) => {
        console.error('Erreur lors du retrait :', err);
        alert('Impossible de retirer le don.');
      },
    });
  }
}
