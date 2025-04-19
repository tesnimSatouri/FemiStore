// src/app/models/avis.model.ts
export interface Avis {
    id?: number; // L'ID est optionnel car il n'existe pas avant la création
    userId: number;
    productId: number;
    note: number;       // Évaluation/Note
    commentaire: string; // Commentaire
    date?: string;      // La date peut être une string si Spring la sérialise ainsi (LocalDate -> ISO String)
                        // Ou un objet Date si vous préférez la parser côté front. String est souvent plus simple.
  }