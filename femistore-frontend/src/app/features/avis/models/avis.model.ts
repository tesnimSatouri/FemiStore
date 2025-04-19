// src/app/models/avis.model.ts
export interface Avis {
    id?: number; // L'ID est optionnel car il n'existe pas avant la création
    userId: number;
    productId: number;
    note: number;       // Évaluation/Note
    commentaire: string; // Commentaire
    date?: string; 
    adminReply?: string; // <--- NOUVEAU CHAMP : Réponse de l'administrateur (optionnel)

    }