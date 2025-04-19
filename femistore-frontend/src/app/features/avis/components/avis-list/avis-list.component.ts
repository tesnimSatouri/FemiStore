import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Avis } from '../../models/avis.model';

@Component({
  selector: 'app-avis-list',
  templateUrl: './avis-list.component.html',
  styleUrls: ['./avis-list.component.css'] // ou .scss
})
export class AvisListComponent {
  @Input() avisList: Avis[] = []; // Reçoit la liste des avis du parent
  @Output() deleteRequest = new EventEmitter<number>(); // Émet l'ID à supprimer
  @Output() editRequest = new EventEmitter<Avis>();     // Émet l'avis à éditer

  onDelete(id: number | undefined): void {
    if (id !== undefined) {
      this.deleteRequest.emit(id);
    }
  }

  onEdit(avis: Avis): void {
    this.editRequest.emit(avis);
  }

  
}