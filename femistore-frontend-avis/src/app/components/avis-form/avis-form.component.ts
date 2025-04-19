import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Avis } from '../../models/avis.model';


@Component({
  selector: 'app-avis-form',
  templateUrl: './avis-form.component.html',
  styleUrls: ['./avis-form.component.css']
})
export class AvisFormComponent implements OnInit, OnChanges {
  @Input() avisToEdit: Avis | null = null; // Reçoit l'avis à éditer (si modification)
  @Input() productId?: number; // Peut recevoir l'ID du produit du parent
  @Output() avisSubmit = new EventEmitter<Avis>(); // Émet l'avis soumis (nouveau ou modifié)

  avisForm: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) {
    this.avisForm = this.fb.group({
      id: [null], // Caché ou non présent dans le form HTML, mais utile pour l'update
      userId: ['', Validators.required], // À adapter : comment récupérez-vous l'userId ?
      productId: ['', Validators.required],
      note: ['', [Validators.required, Validators.min(1), Validators.max(5)]], // Exemple: note de 1 à 5
      commentaire: ['', Validators.required]
      // La date est généralement gérée par le backend
    });
  }

  ngOnInit(): void {
     if (this.productId) {
       this.avisForm.patchValue({ productId: this.productId });
     }
  }

  // Détecte si un avis à éditer est passé en entrée
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['avisToEdit'] && this.avisToEdit) {
      this.isEditMode = true;
      this.avisForm.patchValue(this.avisToEdit); // Pré-remplit le formulaire
    } else if (changes['avisToEdit'] && !this.avisToEdit) {
        this.isEditMode = false;
        this.resetForm(); // Réinitialise si on passe de edit à create
    }
    // Met à jour le productId si l'input change
    if(changes['productId'] && this.productId){
         this.avisForm.patchValue({ productId: this.productId });
    }
  }

  onSubmit(): void {
    if (this.avisForm.valid) {
      // Crée une copie de l'objet form pour éviter les modifs directes
      const submittedAvis: Avis = { ...this.avisForm.value };
      this.avisSubmit.emit(submittedAvis);
      if (!this.isEditMode) { // Reset seulement si c'est une création
        this.resetForm();
      }
    } else {
      // Marquer les champs comme touchés pour afficher les erreurs
      this.avisForm.markAllAsTouched();
      console.error("Formulaire invalide");
    }
  }

  resetForm(): void {
     this.avisForm.reset();
     // Remet le productId s'il était fourni
     if (this.productId) {
       this.avisForm.patchValue({ productId: this.productId });
     }
     this.isEditMode = false;
     this.avisToEdit = null;
  }
}