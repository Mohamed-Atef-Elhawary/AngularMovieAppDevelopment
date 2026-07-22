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
} from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { FavoriteMovie, OmdbMovieSearch } from '../interfaces/omdb-movie';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private firestore: Firestore = inject(Firestore);
  private favCollection: CollectionReference<DocumentData, DocumentData> = collection(
    this.firestore,
    'favorites',
  );

  getFavorites(): Observable<FavoriteMovie[]> {
    return from(
      getDocs(this.favCollection).then((snapshot) =>
        snapshot.docs.map((d) => ({ docId: d.id, ...d.data() }) as FavoriteMovie),
      ),
    );
  }

  addFavorite(movie: OmdbMovieSearch): Observable<any> {
    const { Poster, Title, Type, Year, imdbID } = movie;
    return from(addDoc(this.favCollection, { Poster, Title, Type, Year, imdbID }));
  }

  removeFavorite(docId: string): Observable<void> {
    const docRef = doc(this.firestore, `favorites/${docId}`);
    return from(deleteDoc(docRef));
  }
}
