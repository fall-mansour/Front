import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoventesService, ObjetVente } from '../histoventes.service';
import { environment } from '../../environnement';

@Component({
  selector: 'app-histoventes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './histoventes.component.html',
  styleUrls: ['./histoventes.component.scss']
})
export class HistoventesComponent implements OnInit {
  ventes: ObjetVente[] = [];
  filteredVentes: ObjetVente[] = [];
  loading = false;
  errorMsg: string | null = null;
  searchTerm: string = '';

  // ✅ Injection correcte du service
  constructor(private histoventesService: HistoventesService) {}

  ngOnInit(): void {
    this.chargerVentes();
  }

  chargerVentes() {
    this.loading = true;
    this.errorMsg = null;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.loading = false;
      this.errorMsg = 'Vous devez être connecté pour voir vos ventes.';
      return;
    }

    this.histoventesService.getVentesByUser(+userId).subscribe({
      next: (data) => {
        this.loading = false;
        this.ventes = data;
        this.filteredVentes = [...this.ventes];
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur chargement ventes :', err);
        this.errorMsg = 'Impossible de charger l’historique des ventes.';
      }
    });
  }

  filtrerVentes() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredVentes = term
      ? this.ventes.filter(v => v.description.toLowerCase().includes(term))
      : [...this.ventes];
  }

  retirerVente(id: number) {
    if (!confirm('Voulez-vous vraiment retirer cette publication ?')) {
      return;
    }

    // ✅ Utilisation du service injecté
    this.histoventesService.deleteObjetVente(id).subscribe({
      next: () => {
        this.ventes = this.ventes.filter(v => v.id !== id);
        this.filteredVentes = this.filteredVentes.filter(v => v.id !== id);
        console.log('Vente retirée avec succès');
      },
      error: (err) => {
        console.error('Erreur lors du retrait :', err);
        alert('Impossible de retirer la publication.');
      }
    });
  }
}
