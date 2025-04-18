export interface User {
    _id?: string; // ID MongoDB
    id?: number;  // ID auto-incrémenté
    name: string;
    email: string;
    password?: string; // Optionnel côté client après inscription/connexion
    role: 'Client' | 'Admin';
    adresse?: string;
    telephone?: string;
  }