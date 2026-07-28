import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
  CollectionReference,
  DocumentData,
  DocumentReference,
} from 'firebase/firestore';
import { Observable, from, throwError } from 'rxjs';
import { FavoriteMovie, OmdbMovieSearch } from '../interfaces/omdb-movie';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  favCollection!: CollectionReference<DocumentData, DocumentData>;
  constructor(
    private firestore: Firestore,
    private authService: AuthService,
  ) {}
  ngonInit() {
    this.favCollection = collection(this.firestore, 'favorites');
  }

  getUserFavoritesPath(): string {
    const currentUid = this.authService.uid();
    if (currentUid) {
      return `users/${currentUid}/favorites`;
    }
    throw new Error('[FavoriteService]: Cannot resolve path. User is not authenticated.');
  }

  getFavorites(): Observable<FavoriteMovie[]> {
    try {
      const path = this.getUserFavoritesPath();
      const favCollection = collection(this.firestore, path);
      return from(
        getDocs(favCollection).then((snapshot) =>
          snapshot.docs.map((d) => ({ docId: d.id, ...d.data() }) as FavoriteMovie),
        ),
      );
    } catch (err) {
      return throwError(() => err);
    }
  }

  addFavorite(movie: OmdbMovieSearch): Observable<DocumentReference<DocumentData>> {
    try {
      const path = this.getUserFavoritesPath();
      const favCollection = collection(this.firestore, path);
      return from(addDoc(favCollection, movie));
    } catch (err) {
      return throwError(() => err);
    }
  }

  removeFavorite(docId: string): Observable<void> {
    try {
      const currentUid = this.authService.uid();
      const docRef = doc(this.firestore, `users/${currentUid}/favorites/${docId}`);
      return from(deleteDoc(docRef));
    } catch (err) {
      return throwError(() => err);
    }
  }
}
