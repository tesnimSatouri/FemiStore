import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AvisService } from '../../services/avis.service';
import { Avis } from '../../models/avis.model';
import { PaginatedAvisResponse } from '../../models/page.model'; // Importer le modèle de page
import { Observable, BehaviorSubject, Subject, switchMap, catchError, of, tap, takeUntil, finalize } from 'rxjs';
import { map } from 'rxjs/operators';
import { AvisFormComponent } from '../../components/avis-form/avis-form.component';

@Component({
  selector: 'app-product-reviews',
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.css']
})
export class ProductReviewsComponent implements OnInit, OnDestroy {

  productId!: number;
  averageRating$: Observable<number | null> | undefined;
  avisToEdit: Avis | null = null;
  showAddForm: boolean = false;

  // --- State pour Pagination et Filtrage ---
  // Remplacer reviews$ par un BehaviorSubject pour les données paginées
  private reviewsSubject = new BehaviorSubject<PaginatedAvisResponse | null>(null);
  reviewsPage$: Observable<PaginatedAvisResponse | null> = this.reviewsSubject.asObservable();

  currentPage: number = 0; // Page actuelle (commence à 0)
  pageSize: number = 5;    // Nombre d'avis par page
  currentFilterNote: number | null = null; // Filtre de note actif (null = tous)
  isLoading: boolean = false;
  loadError: string | null = null; // Pour afficher les erreurs de chargement

  // Pour le tri (optionnel, exemple)
  currentSort: string = 'date,desc';

  // Subject pour se désabonner proprement
  private destroy$ = new Subject<void>();

  @ViewChild(AvisFormComponent) avisFormComponent: AvisFormComponent | undefined;

  constructor(
    private route: ActivatedRoute,
    private avisService: AvisService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$), // Se désabonner à la destruction
      tap(params => {
        const id = params.get('productId');
        if (id) {
          this.productId = +id;
          this.loadAverageRating(); // Charger la note moyenne
          this.loadReviews();       // Charger la première page d'avis
        } else {
          console.error("Product ID manquant dans l'URL");
          this.loadError = "ID Produit manquant dans l'URL.";
        }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAverageRating(): void {
    if (!this.productId) return;
    this.averageRating$ = this.avisService.getAverageRating(this.productId).pipe(
      catchError(err => {
        console.error("Erreur chargement note moyenne:", err);
        // Gérer l'erreur d'affichage si nécessaire
        return of(null);
      })
    );
  }

  loadReviews(): void {
    if (!this.productId) return;

    this.isLoading = true;
    this.loadError = null; // Réinitialiser l'erreur
    this.reviewsSubject.next(null); // Optionnel: Vider pendant le chargement

    this.avisService.getReviewsForProduct(
      this.productId,
      this.currentPage,
      this.pageSize,
      this.currentFilterNote,
      this.currentSort
    ).pipe(
      takeUntil(this.destroy$),
      tap(response => {
         // Mettre à jour la page actuelle si elle dépasse le nombre total de pages
         // (utile après suppression sur la dernière page)
         if(response.totalPages > 0 && this.currentPage >= response.totalPages) {
             this.currentPage = response.totalPages - 1;
             // Relancer le chargement pour la page corrigée
             // Attention: peut causer boucle si mal géré, vérifier la condition
             if(this.currentPage >= 0) {
                 this.loadReviews(); // Relance avec la page corrigée
             } else {
                  this.reviewsSubject.next(response); // Ou afficher la réponse vide reçue
             }
         } else {
             this.reviewsSubject.next(response); // Mettre à jour les données
         }
      }),
      catchError(err => {
        console.error("Erreur chargement avis:", err);
        this.loadError = "Erreur lors du chargement des avis.";
        this.reviewsSubject.next(null); // Mettre à null en cas d'erreur
        return of(null); // Retourner un observable qui complète
      }),
      finalize(() => {
        this.isLoading = false; // Arrêter le chargement dans tous les cas
      })
    ).subscribe();
  }

  // --- Méthodes pour la Pagination ---
  goToPage(pageNumber: number): void {
    if (pageNumber !== this.currentPage) {
      this.currentPage = pageNumber;
      this.loadReviews();
    }
  }

  nextPage(): void {
     // Vérifier si on n'est pas déjà sur la dernière page (logique à affiner avec les données reçues)
     // On utilisera `reviewsPage.last` dans le template pour désactiver
     this.currentPage++;
     this.loadReviews();
  }

  previousPage(): void {
     // Vérifier si on n'est pas déjà sur la première page
     // On utilisera `reviewsPage.first` dans le template pour désactiver
     this.currentPage--;
     this.loadReviews();
  }


  // --- Méthode pour le Filtrage ---
  applyFilter(note: string | null): void {
     // Convertir la valeur du select ('null' ou '1'...'5')
     const filterValue = (note === null || note === 'null' || note === '') ? null : parseInt(note, 10);

     if (this.currentFilterNote !== filterValue) {
        this.currentFilterNote = filterValue;
        this.currentPage = 0; // Revenir à la première page lors d'un changement de filtre
        this.loadReviews();
     }
  }

  // --- Méthodes CRUD mises à jour ---
  handleAvisSubmit(avis: Avis): void {
      const isUpdate = !!avis.id; // Vérifie si c'est une mise à jour
      const operation$ = isUpdate
          ? this.avisService.updateReview(avis.id!, avis)
          : this.avisService.addReview({ ...avis, productId: this.productId });

      this.isLoading = true; // Indiquer le chargement pendant l'opération

      operation$.pipe(
          takeUntil(this.destroy$),
          finalize(() => this.isLoading = false) // Arrêter le chargement après l'opération
      ).subscribe({
          next: () => {
              console.log(isUpdate ? "Avis mis à jour !" : "Avis ajouté !");
              this.hideForm();
              this.loadAverageRating(); // Recharger la note moyenne
              // Recharger la page actuelle après ajout/modification
              this.loadReviews();
              // TODO: Décider si on veut aller à la première page après ajout ?
              // this.currentPage = 0; this.loadReviews();
          },
          error: (err) => {
              console.error(isUpdate ? "Erreur MàJ avis:" : "Erreur ajout avis:", err);
              this.loadError = `Erreur lors de ${isUpdate ? 'la mise à jour' : "l'ajout"} de l'avis.`;
              // Ne pas cacher le formulaire en cas d'erreur pour permettre correction
          }
      });
  }

  handleDeleteRequest(id: number): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
      this.isLoading = true;
      this.avisService.deleteReview(id).pipe(
          takeUntil(this.destroy$),
          finalize(() => this.isLoading = false)
      ).subscribe({
        next: () => {
          console.log("Avis supprimé !");
           if (this.avisToEdit?.id === id) {
                this.hideForm();
           }
           this.loadAverageRating(); // Recharger la note moyenne
           // Recharger la page actuelle. La logique dans loadReviews gère si la page devient vide.
           this.loadReviews();
        },
        error: (err) => {
             console.error("Erreur suppression avis:", err);
             this.loadError = "Erreur lors de la suppression de l'avis.";
        }
      });
    }
  }

  handleEditRequest(avis: Avis): void {
     this.showAddForm = false;
     this.avisToEdit = { ...avis };
     setTimeout(() => document.querySelector('app-avis-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  displayAddForm(): void {
    this.avisToEdit = null;
    this.showAddForm = true;
    setTimeout(() => this.avisFormComponent?.resetForm(), 0);
    setTimeout(() => document.querySelector('app-avis-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  hideForm(): void {
      this.showAddForm = false;
      this.avisToEdit = null;
  }
}