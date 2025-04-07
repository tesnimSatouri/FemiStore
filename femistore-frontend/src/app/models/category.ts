export interface Category {
    id?: number;
    name: string;
    description: string;
    parent?: Category;
    createdAt?: string;
    updatedAt?: string;
  }