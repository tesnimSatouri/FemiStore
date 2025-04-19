import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';
import { Avis } from '../models/avis.model'; // Importez votre modèle
import { PaginatedAvisResponse } from '../models/page.model'; // Importer le modèle de page

@Injectable({
  providedIn: 'root' // Service disponible globalement
})
export class AvisService {

  private apiUrl = 'http://localhost:8089/avis'; // Utilise l'URL de l'environnement
  ; // Utilise l'URL de l'environnementy
  constructor(private http: HttpClient) { }

  // GET /avis
  getAllReviews(): Observable<Avis[]> {
    return this.http.get<Avis[]>(this.apiUrl);
  }

  // POST /avis
  addReview(avis: Avis): Observable<Avis> {
    // Assurez-vous que l'objet avis contient userId, productId, note, commentaire
    // L'ID sera généré par le backend
    return this.http.post<Avis>(this.apiUrl, avis);
  }

  // DELETE /avis/{id}
  deleteReview(id: number): Observable<void> { // Pas de contenu retourné (void)
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // GET /avis/average/{productId}
  getAverageRating(productId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/average/${productId}`);
  }

  // PUT /avis/{id}
  updateReview(id: number, avis: Avis): Observable<Avis> {
    return this.http.put<Avis>(`${this.apiUrl}/${id}`, avis);
  }

  // GET /avis/filter?min={min}&max={max}
  getReviewsByNoteRange(min: number, max: number): Observable<Avis[]> {
    let params = new HttpParams()
      .set('min', min.toString())
      .set('max', max.toString());
    return this.http.get<Avis[]>(`${this.apiUrl}/filter`, { params });
  }

  // GET /avis/categorized?threshold={threshold}
  // Définissons une interface pour la réponse
  getCategorizedReviews(threshold: number): Observable<{ positive: Avis[], negative: Avis[] }> {
     let params = new HttpParams().set('threshold', threshold.toString());
     return this.http.get<{ positive: Avis[], negative: Avis[] }>(`${this.apiUrl}/categorized`, { params });
  }

  // GET /avis/highest-rated
  getHighestRatedReviews(): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiUrl}/highest-rated`);
  }

  // GET /avis/lowest-rated
  getLowestRatedReviews(): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiUrl}/lowest-rated`);
  }



 // **** NOUVELLE MÉTHODE PAGINÉE ****
 getReviewsForProduct(
  productId: number,
  page: number,
  size: number,
  note?: number | null, // note peut être un nombre ou null (pour 'tous')
  sort: string = 'date,desc' // Tri par défaut
): Observable<PaginatedAvisResponse> {

  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sort', sort); // Ajouter le tri

  if (note !== null && note !== undefined) {
       // On ajoute le paramètre 'note' seulement s'il a une valeur valide
       if (note >= 1 && note <= 5) {
           params = params.set('note', note.toString());
       } else {
           console.warn("Tentative de filtrage avec une note invalide :", note);
           // Ne pas ajouter le paramètre si la note est invalide (ou lancer une erreur ?)
       }
  }

  // Appel du nouvel endpoint backend
  return this.http.get<PaginatedAvisResponse>(`${this.apiUrl}/product/${productId}`, { params });
}
// **** FIN NOUVELLE MÉTHODE ****
 // **** NOUVELLE MÉTHODE POUR LA LISTE GLOBALE PAGINÉE ****
 getAllReviewsPaginated(
  page: number,
  size: number,
  sort: string = 'date,desc' // Tri par défaut
): Observable<PaginatedAvisResponse> {

  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sort', sort);

  // Appel du NOUVEL endpoint backend (ex: /avis/paginated)
  // Assurez-vous que l'URL est correcte !
  return this.http.get<PaginatedAvisResponse>(`${this.apiUrl}/paginated`, { params });
}
// **** FIN NOUVELLE MÉTHODE ****

}