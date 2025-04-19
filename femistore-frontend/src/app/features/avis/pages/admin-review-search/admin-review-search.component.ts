// src/app/pages/admin-review-search/admin-review-search.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { AvisService } from '../../services/avis.service';
import { Avis } from '../../models/avis.model';
import { PaginatedAvisResponse } from '../../models/page.model'; // <-- Assurez-vous d'importer ceci
import { Subject, of } from 'rxjs';
import { takeUntil, finalize, catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-review-search',
  templateUrl: './admin-review-search.component.html',
  styleUrls: ['./admin-review-search.component.css']
})
export class AdminReviewSearchComponent implements OnInit, OnDestroy {
  // --- State pour la recherche spécifique ---
  productIdToSearch: number | null = null;
  displayedProductId: number | null = null;
  searchError: string | null = null;

  // --- State pour la liste de TOUS les avis (maintenant paginée) ---
  // allReviewsList: Avis[] = []; // <- Remplacé par allReviewsPage
  allReviewsPage: PaginatedAvisResponse | null = null; // <-- NOUVEAU: Stocke la réponse paginée
  allReviewsCurrentPage: number = 0;                   // <-- NOUVEAU: Page actuelle (commence à 0)
  allReviewsPageSize: number = 3;                     // <-- NOUVEAU: Taille de page (ex: 10)
  allReviewsSort: string = 'date,desc';                // <-- NOUVEAU: Tri actuel

  isLoadingAll: boolean = false;
  loadAllError: string | null = null;
  avisToEditInAllList: Avis | null = null;
  showEditFormForAllList: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private avisService: AvisService) { }

  ngOnInit(): void {
    // Charger la première page de tous les avis
    this.loadAllReviews();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- MODIFIÉ: Méthode pour charger tous les avis (maintenant paginée) ---
  loadAllReviews(): void {
    this.isLoadingAll = true;
    this.loadAllError = null;
    // Ne vide pas la page précédente immédiatement pour éviter un flash visuel
    // this.allReviewsPage = null;

    this.avisService.getAllReviewsPaginated( // <-- Utilise la NOUVELLE méthode du service
      this.allReviewsCurrentPage,
      this.allReviewsPageSize,
      this.allReviewsSort
    ).pipe(
      takeUntil(this.destroy$),
      tap(pageResponse => {
         if (!pageResponse) return; // Sécurité si la réponse est null
        console.log(`[AdminSearch] Loaded page ${pageResponse.number} of global reviews.`);
        this.allReviewsPage = pageResponse; // <-- Stocke la réponse paginée complète

        // Gestion si la page actuelle devient invalide (ex: après suppression du dernier item)
        if(pageResponse.totalPages > 0 && this.allReviewsCurrentPage >= pageResponse.totalPages) {
            console.log(`[AdminSearch] Global current page ${this.allReviewsCurrentPage} is out of bounds (Total: ${pageResponse.totalPages}). Going to last page.`);
            // Décrémente la page et recharge SEULEMENT si la page résultante est valide (>=0)
            this.allReviewsCurrentPage = Math.max(0, pageResponse.totalPages - 1);
            // Relance immédiatement le chargement avec la page corrigée
            this.loadAllReviews();
            // Important : On ne continue pas l'exécution de ce tap pour éviter de traiter une page qui va être rechargée
            return;
        }
      }),
      catchError(err => {
        console.error("[AdminSearch] Error loading all reviews (paginated):", err);
        this.loadAllError = "Erreur lors du chargement de la liste paginée des avis.";
        this.allReviewsPage = null; // Vider en cas d'erreur
        return of(null);
      }),
      finalize(() => {
        this.isLoadingAll = false;
      })
    ).subscribe();
  }

  // --- Méthode appelée lors de la recherche par ID produit (logique d'affichage inchangée) ---
  searchReviews(): void {
    this.searchError = null;
    this.loadAllError = null;
    this.cancelGlobalEdit();

    if (this.productIdToSearch !== null && this.productIdToSearch > 0) {
      console.log(`[AdminSearch] Searching for product ID: ${this.productIdToSearch}`);
      this.displayedProductId = this.productIdToSearch;
    } else {
      this.displayedProductId = null;
      this.searchError = "Veuillez entrer un ID de produit valide (nombre positif).";
      // S'assurer que la vue globale est correctement chargée si elle ne l'était pas
       if (!this.allReviewsPage && !this.isLoadingAll) {
          this.loadAllReviews();
       }
    }
  }

  // --- MODIFIÉ: Méthode pour effacer la recherche et revenir à la liste globale ---
  clearSearch(): void {
      console.log("[AdminSearch] Clearing search, showing all reviews.");
      this.productIdToSearch = null;
      this.displayedProductId = null;
      this.searchError = null;
      this.cancelGlobalEdit();

      // Revenir à la première page et recharger la liste globale
      this.allReviewsCurrentPage = 0;
      this.loadAllReviews(); // Recharger la première page globale
  }

  // --- MODIFIÉ: Gérer la suppression (recharge la page actuelle) ---
  handleAllDeleteRequest(id: number | undefined): void {
      if (id === undefined) {
          console.error("[AdminSearch] Delete requested with undefined ID.");
          return;
      }
      if (confirm(`Voulez-vous vraiment supprimer l'avis ID ${id} ? Cette action est irréversible.`)) {
          // Optionnel: Mettre isLoadingAll à true ou un indicateur spécifique
          this.isLoadingAll = true; // Met l'indicateur pendant la suppression
          this.avisService.deleteReview(id).pipe(
              takeUntil(this.destroy$),
              finalize(() => {
                // Ne pas remettre isLoadingAll à false ici, car loadAllReviews va le faire
              })
          ).subscribe({
              next: () => {
                  console.log(`[AdminSearch] Review ID ${id} deleted successfully.`);
                  // Si l'avis supprimé était en cours d'édition, annuler
                  if (this.avisToEditInAllList?.id === id) {
                     this.cancelGlobalEdit();
                  }
                  // Recharger la page actuelle pour refléter la suppression.
                  // loadAllReviews gère le cas où la page devient vide et ajuste si besoin.
                  this.loadAllReviews();
              },
              error: (err) => {
                  console.error(`[AdminSearch] Error deleting review ID ${id}:`, err);
                  this.loadAllError = `Erreur lors de la suppression de l'avis ID ${id}.`;
                  this.isLoadingAll = false; // S'assurer que l'indicateur s'arrête en cas d'erreur
              }
          });
      }
  }

  // --- Gérer la demande d'édition (inchangé) ---
  handleAllEditRequest(avis: Avis): void {
      console.log(`[AdminSearch] Edit requested for review ID ${avis.id} from global list.`);
      this.avisToEditInAllList = { ...avis };
      this.showEditFormForAllList = true;
      this.searchError = null;
      this.loadAllError = null;
       setTimeout(() => {
           const formElement = document.querySelector('#global-edit-form');
           formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
       }, 50);
  }

   // --- MODIFIÉ: Gérer la soumission (recharge la page actuelle) ---
   handleGlobalEditSubmit(avis: Avis): void {
       if (!avis.id) {
           console.error("[AdminSearch] Cannot update review without ID.");
           alert("Erreur : Impossible de mettre à jour l'avis sans son ID.");
           return;
       }
       console.log(`[AdminSearch] Submitting update for review ID ${avis.id} from global form.`);
       this.isLoadingAll = true; // Optionnel: indicateur pendant la sauvegarde

       this.avisService.updateReview(avis.id, avis).pipe(
           takeUntil(this.destroy$),
           finalize(() => {
             // Ne pas remettre isLoadingAll à false ici, car loadAllReviews va le faire
           })
       ).subscribe({
           next: (updatedAvis) => {
               console.log(`[AdminSearch] Review ID ${avis.id} updated successfully.`);
               this.cancelGlobalEdit(); // Cacher le formulaire après succès
               // Recharger la page actuelle pour voir la modification
               this.loadAllReviews();
           },
           error: (err) => {
               console.error(`[AdminSearch] Error updating review ID ${avis.id}:`, err);
               alert(`Erreur lors de la mise à jour de l'avis ID ${avis.id}. Détails: ${err.message || 'Erreur inconnue'}`);
               this.isLoadingAll = false; // Arrêter l'indicateur en cas d'erreur
           }
       });
   }

    // --- Méthode pour annuler l'édition globale (inchangée) ---
    cancelGlobalEdit(): void {
        this.showEditFormForAllList = false;
        this.avisToEditInAllList = null;
    }

    // --- NOUVELLES MÉTHODES POUR LA PAGINATION GLOBALE ---
    goToGlobalPage(page: number): void {
      // Vérifie si la page demandée est valide et différente de la page actuelle
      if (page >= 0 && this.allReviewsPage && page < this.allReviewsPage.totalPages && page !== this.allReviewsCurrentPage) {
        console.log(`[AdminSearch] Going to global page: ${page}`);
        this.allReviewsCurrentPage = page;
        this.loadAllReviews(); // Recharge les données pour la nouvelle page
      }
    }

    nextGlobalPage(): void {
      // Vérifie s'il y a une page suivante avant de l'appeler
      if (this.allReviewsPage && !this.allReviewsPage.last) {
        this.goToGlobalPage(this.allReviewsCurrentPage + 1);
      }
    }

    previousGlobalPage(): void {
      // Vérifie s'il y a une page précédente avant de l'appeler
      if (this.allReviewsPage && !this.allReviewsPage.first) {
        this.goToGlobalPage(this.allReviewsCurrentPage - 1);
      }
    }

    // Optionnel: Méthode pour changer le tri (à lier dans le template si besoin)
    applyGlobalSort(sortValue: string): void {
        if (this.allReviewsSort !== sortValue) {
            console.log(`[AdminSearch] Applying global sort: ${sortValue}`);
            this.allReviewsSort = sortValue;
            this.allReviewsCurrentPage = 0; // Revenir à la première page avec le nouveau tri
            this.loadAllReviews();
        }
    }
    // --- FIN NOUVELLES MÉTHODES ---
}