// src/app/models/page.model.ts ou similaire
import { Avis } from './avis.model';

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Numéro de la page actuelle (commence à 0)
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number; // Nombre d'éléments sur la page actuelle
  empty: boolean;
}

// Type spécifique pour la pagination des avis
export type PaginatedAvisResponse = Page<Avis>;