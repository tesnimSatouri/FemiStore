// src/app/pages/product-reviews/product-reviews.component.ts

// Importez Input, OnChanges, SimpleChanges
import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AvisService } from '../../services/avis.service';
import { Avis } from '../../models/avis.model';
import { PaginatedAvisResponse } from '../../models/page.model';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { switchMap, catchError, tap, takeUntil, finalize } from 'rxjs/operators';
// map n'est plus explicitement utilisé dans ce code après refactoring, mais gardez-le si vous en avez besoin ailleurs.
// import { map } from 'rxjs/operators';
import { AvisFormComponent } from '../../components/avis-form/avis-form.component';

@Component({
  selector: 'app-product-reviews',
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.css']
})
// Implémentez OnChanges
export class ProductReviewsComponent implements OnInit, OnDestroy, OnChanges {

  // --- NOUVEAU: Input pour l'ID produit venant d'un parent ---
  @Input() productIdInput?: number;

  // --- ID Produit interne utilisé par le composant ---
  productId!: number; // Sera défini par ngOnInit ou ngOnChanges

  // --- Propriétés existantes ---
  averageRating$: Observable<number | null> | undefined;
  avisToEdit: Avis | null = null;
  showAddForm: boolean = false;
  private reviewsSubject = new BehaviorSubject<PaginatedAvisResponse | null>(null);
  reviewsPage$: Observable<PaginatedAvisResponse | null> = this.reviewsSubject.asObservable();
  currentPage: number = 0;
  pageSize: number = 5;
  currentFilterNote: number | null = null;
  isLoading: boolean = false;
  loadError: string | null = null;
  currentSort: string = 'date,desc'; // Valeur par défaut du tri
  private destroy$ = new Subject<void>();
  @ViewChild(AvisFormComponent) avisFormComponent: AvisFormComponent | undefined;

  constructor(
    private route: ActivatedRoute, // Gardé pour le cas d'utilisation via la route
    private avisService: AvisService
  ) { }

  // --- MODIFIÉ: ngOnInit ---
  ngOnInit(): void {
    // Priorité à l'Input pour déterminer l'ID produit
    if (this.productIdInput !== undefined) {
      console.log('[ProductReviews] Initializing with Input ID:', this.productIdInput);
      this.initializeComponent(this.productIdInput);
    } else {
      // Si pas d'Input, on regarde les paramètres de la route
      console.log('[ProductReviews] Initializing with Route Param');
      this.route.paramMap.pipe(
        takeUntil(this.destroy$) // Se désabonner proprement
      ).subscribe(params => {
        const id = params.get('productId');
        if (id) {
          // Paramètre de route trouvé, on initialise
          this.initializeComponent(+id);
        } else {
          // Ni Input, ni paramètre de route valide
          console.error("[ProductReviews] Product ID missing from Input and Route!");
          this.loadError = "ID Produit non fourni.";
          this.clearComponentState(); // Effacer l'état si aucun ID n'est trouvé
        }
      });
    }
  }

  // --- NOUVEAU: ngOnChanges ---
  // Détecte les changements sur les @Input APRES l'initialisation
  ngOnChanges(changes: SimpleChanges): void {
    // Vérifie si 'productIdInput' a changé ET que ce n'est pas le premier changement
    if (changes['productIdInput'] && !changes['productIdInput'].firstChange) {
      const newId = changes['productIdInput'].currentValue;
      const previousId = changes['productIdInput'].previousValue;

      console.log(`[ProductReviews] Input ID changed from ${previousId} to ${newId}`);

      if (newId !== undefined && newId > 0 && newId !== this.productId) {
        // Si un nouvel ID valide est fourni via l'Input et différent de l'actuel, réinitialiser
        this.initializeComponent(newId);
      } else if (newId === undefined || newId <= 0) {
         // Si l'ID devient invalide ou undefined (ex: admin efface sa recherche)
        console.log('[ProductReviews] Input ID removed or invalid, clearing state.');
        this.clearComponentState();
      }
    }
  }

  // --- NOUVEAU: Méthode privée pour centraliser l'initialisation ---
  private initializeComponent(id: number): void {
    if (!id || id <= 0) {
        console.error("[ProductReviews] Attempted to initialize with invalid ID:", id);
        this.clearComponentState();
        this.loadError = "ID Produit invalide fourni.";
        return;
    }

    console.log(`[ProductReviews] Setting up for Product ID: ${id}`);
    this.productId = id; // Définit l'ID interne

    // Réinitialiser l'état avant de charger les nouvelles données
    this.avisToEdit = null;
    this.showAddForm = false;
    this.currentPage = 0; // Toujours revenir à la page 1
    this.currentFilterNote = null; // Réinitialiser le filtre
    this.currentSort = 'date,desc'; // Réinitialiser le tri (ou garder le précédent?)
    this.loadError = null;
    this.isLoading = false;
    this.reviewsSubject.next(null); // Vider les anciens avis
    this.averageRating$ = undefined; // Vider l'ancienne moyenne

    // Charger les nouvelles données pour le nouvel ID
    this.loadAverageRating();
    this.loadReviews();
  }

  // --- NOUVEAU: Méthode privée pour effacer l'état ---
  private clearComponentState(): void {
      console.log("[ProductReviews] Clearing component state.");
      this.productId = 0; // Ou une autre valeur indiquant "pas d'ID"
      this.averageRating$ = of(null); // Mettre la moyenne à null
      this.reviewsSubject.next(null); // Vider la liste des avis
      this.avisToEdit = null;
      this.showAddForm = false;
      this.loadError = "Aucun produit sélectionné ou ID invalide.";
      this.isLoading = false;
      // Réinitialisez d'autres états si nécessaire (currentPage, filtres...)
      this.currentPage = 0;
      this.currentFilterNote = null;
      this.currentSort = 'date,desc';
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- Méthodes de chargement (utilisent maintenant this.productId) ---
  loadAverageRating(): void {
    // --- MODIFIÉ: Vérifier this.productId ---
    if (!this.productId || this.productId <= 0) {
      this.averageRating$ = of(null); // Assigner un observable null si pas d'ID valide
      return;
    }
    this.averageRating$ = this.avisService.getAverageRating(this.productId).pipe(
      catchError(err => {
        console.error(`[ProductReviews] Erreur chargement note moyenne pour ID ${this.productId}:`, err);
        return of(null); // Retourne null en cas d'erreur
      })
    );
  }

  loadReviews(): void {
    // --- MODIFIÉ: Vérifier this.productId ---
    if (!this.productId || this.productId <= 0) {
      this.reviewsSubject.next(null); // Pas d'avis si pas d'ID valide
      this.isLoading = false; // S'assurer que loading est false
      return;
    }

    this.isLoading = true;
    this.loadError = null; // Réinitialiser l'erreur à chaque chargement

    // Utilise this.productId, this.currentPage, etc.
    this.avisService.getReviewsForProduct(
      this.productId,
      this.currentPage,
      this.pageSize,
      this.currentFilterNote,
      this.currentSort
    ).pipe(
      takeUntil(this.destroy$),
      tap(response => {
         // Gestion de la pagination si la page actuelle devient invalide (ex: après suppression)
         if(response && response.totalPages > 0 && this.currentPage >= response.totalPages) {
             console.log(`[ProductReviews] Current page ${this.currentPage} is out of bounds (Total: ${response.totalPages}). Going to last page.`);
             this.currentPage = response.totalPages - 1;
             if(this.currentPage >= 0) {
                 this.loadReviews(); // Relance avec la page corrigée
             } else {
                  // Cas où il n'y a plus de pages du tout
                  this.reviewsSubject.next(response);
             }
         } else if (response) {
             this.reviewsSubject.next(response); // Mettre à jour les données
         } else {
              // Cas où la réponse est null/undefined (peut arriver avec catchError)
              this.reviewsSubject.next(null);
         }
      }),
      catchError(err => {
        console.error(`[ProductReviews] Erreur chargement avis pour ID ${this.productId}:`, err);
        this.loadError = "Erreur lors du chargement des avis.";
        this.reviewsSubject.next(null); // Mettre à null en cas d'erreur
        return of(null); // Retourner un observable qui complète
      }),
      finalize(() => {
        this.isLoading = false; // Arrêter le chargement dans tous les cas
      })
    ).subscribe();
  }

  // --- Méthodes pour la Pagination (inchangées, utilisent loadReviews) ---
  goToPage(pageNumber: number): void {
    if (pageNumber !== this.currentPage && pageNumber >= 0) { // Ajouter vérification page >= 0
      this.currentPage = pageNumber;
      this.loadReviews();
    }
  }

  nextPage(): void {
     // La désactivation se fait via `reviewsPage.last` dans le template
     this.currentPage++;
     this.loadReviews();
  }

  previousPage(): void {
     // La désactivation se fait via `reviewsPage.first` dans le template
     if (this.currentPage > 0) { // S'assurer de ne pas aller en dessous de 0
        this.currentPage--;
        this.loadReviews();
     }
  }

  // --- Méthode pour le Filtrage par Note (inchangée, utilise loadReviews) ---
  applyFilter(note: string | null): void {
     const filterValue = (note === null || note === 'null' || note === '') ? null : parseInt(note, 10);
     // Validation optionnelle de la note (1-5)
     const validFilterValue = (filterValue !== null && (filterValue < 1 || filterValue > 5)) ? null : filterValue;

     if (this.currentFilterNote !== validFilterValue) {
        this.currentFilterNote = validFilterValue;
        this.currentPage = 0; // Revenir à la première page
        this.loadReviews();
     }
  }

  // --- Méthode pour le Tri (inchangée, utilise loadReviews) ---
  applySort(sortValue: string): void {
    if (this.currentSort !== sortValue) {
        this.currentSort = sortValue;
        this.currentPage = 0; // Revenir à la première page
        this.loadReviews();
    }
  }

  // --- Méthodes CRUD mises à jour ---
  handleAvisSubmit(avis: Avis): void {
      // --- MODIFIÉ: Vérifier this.productId ---
      if (!this.productId || this.productId <= 0) {
            console.error("[ProductReviews] Cannot submit review without a valid Product ID.");
            this.loadError = "Erreur interne : ID Produit manquant ou invalide.";
            return;
      }

      const isUpdate = !!avis.id;
      // Assurez-vous que l'ID produit est correctement défini, surtout pour l'ajout
      const avisPayload = isUpdate ? avis : { ...avis, productId: this.productId };

      console.log(`[ProductReviews] Submitting review (Update: ${isUpdate}):`, avisPayload);

      const operation$ = isUpdate
          ? this.avisService.updateReview(avis.id!, avisPayload) // Utilisez avisPayload ici aussi par cohérence
          : this.avisService.addReview(avisPayload);

      this.isLoading = true;

      operation$.pipe(
          takeUntil(this.destroy$),
          finalize(() => this.isLoading = false)
      ).subscribe({
          next: (savedAvis) => { // Le backend retourne souvent l'avis sauvegardé
              console.log(`[ProductReviews] Avis ${isUpdate ? 'mis à jour' : 'ajouté'} avec succès:`, savedAvis);
              this.hideForm(); // Masquer le formulaire
              this.loadAverageRating(); // Mettre à jour la note moyenne
              // Recharger les avis de la page courante pour voir le nouvel avis/modif
              this.loadReviews();
              // Optionnel : Aller à la première page après un ajout ?
              // if (!isUpdate) { this.goToPage(0); }
          },
          error: (err) => {
              console.error(`[ProductReviews] Erreur ${isUpdate ? 'MàJ' : 'ajout'} avis:`, err);
              this.loadError = `Erreur lors de ${isUpdate ? 'la mise à jour' : "l'ajout"} de l'avis. Vérifiez les données saisies.`;
              // Laisser le formulaire ouvert pour correction
          }
      });
  }

  handleDeleteRequest(id: number | undefined): void { // Gérer le cas où id est undefined
    if (id === undefined) {
        console.error("[ProductReviews] Attempted to delete review with undefined ID.");
        return;
    }
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'avis ID ${id} ?`)) {
      this.isLoading = true;
      this.avisService.deleteReview(id).pipe(
          takeUntil(this.destroy$),
          finalize(() => this.isLoading = false)
      ).subscribe({
        next: () => {
          console.log(`[ProductReviews] Avis ID ${id} supprimé !`);
           // Si l'avis en cours d'édition a été supprimé, fermer le formulaire
           if (this.avisToEdit?.id === id) {
                this.hideForm();
           }
           this.loadAverageRating(); // Mettre à jour la note moyenne
           // Recharger la page actuelle. `loadReviews` gère si la page devient vide.
           this.loadReviews();
        },
        error: (err) => {
             console.error(`[ProductReviews] Erreur suppression avis ID ${id}:`, err);
             this.loadError = "Erreur lors de la suppression de l'avis.";
        }
      });
    }
  }

  handleEditRequest(avis: Avis): void {
     // Pas besoin de vérifier productId ici, on modifie un avis existant
     this.avisToEdit = { ...avis }; // Copier l'objet pour éviter la modification directe
     this.showAddForm = true; // Afficher le formulaire (le template gère le titre "Modifier")
     console.log("[ProductReviews] Editing review:", this.avisToEdit);
     // Scroll vers le formulaire pour le rendre visible
     setTimeout(() => document.querySelector('app-avis-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  displayAddForm(): void {
    // --- MODIFIÉ: Vérifier productId ---
    if (!this.productId || this.productId <= 0) {
        console.warn("[ProductReviews] Cannot display add form without a valid Product ID.");
        this.loadError = "Veuillez d'abord sélectionner un produit valide.";
        return;
    }
    this.avisToEdit = null; // Assurez-vous qu'on n'est pas en mode édition
    this.showAddForm = true;
    console.log("[ProductReviews] Displaying add form.");
    // Réinitialiser le formulaire enfant (important si on annule une édition puis on ajoute)
    setTimeout(() => this.avisFormComponent?.resetForm(), 0); // Utiliser resetForm du composant enfant
    // Scroll vers le formulaire
    setTimeout(() => document.querySelector('app-avis-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  hideForm(): void {
      this.showAddForm = false;
      this.avisToEdit = null; // Quitter le mode édition aussi
      console.log("[ProductReviews] Hiding form.");
  }
}