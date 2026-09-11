import { TestBed } from '@angular/core/testing';
import { FavoriteService } from './favorite-service';
import { Mock } from 'vitest';
import { AuthService } from './auth-service';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs } from 'firebase/firestore';
import { FavoriteMovie, OmdbMovieSearch } from '../interfaces/omdb-movie';
import { firstValueFrom, from } from 'rxjs';
interface AuthServiceInterface {
  uid: Mock<AuthService['uid']>;
}
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...actual,
    collection: vi.fn(),
    addDoc: vi.fn(),
    doc: vi.fn(),
    deleteDoc: vi.fn(),
    getDocs: vi.fn(),
  };
});

const mockCollection = collection as Mock;
const mockGetDocs = getDocs as Mock;
const mockAddDoc = addDoc as Mock;
const mockDoc = doc as Mock;
const mockDeleteDoc = deleteDoc as Mock;

interface DocsMovie {
  id: string;
  data: () => OmdbMovieSearch;
}
describe('FavoriteService', () => {
  let favoriteService: FavoriteService;
  let mockAuthService: AuthServiceInterface;

  beforeEach(() => {
    mockAuthService = { uid: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: Firestore, useValue: {} },
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
    favoriteService = TestBed.inject(FavoriteService);
  });

  it('should be created', () => {
    expect(favoriteService).toBeTruthy();
  });
  describe('getUserFavoritesPath', () => {
    it('should return userId if exists', () => {
      mockAuthService.uid.mockReturnValue('1');
      const userId = favoriteService.getUserFavoritesPath();
      expect(userId).toBe('users/1/favorites');
    });
    it('should throw an error if userId doesnot exist', () => {
      mockAuthService.uid.mockReturnValue(null);
      expect(() => favoriteService.getUserFavoritesPath()).toThrow(
        '[FavoriteService]: Cannot resolve path. User is not authenticated.',
      );
    });
  });

  describe('getFavorites', () => {
    describe('when there is a userId', () => {
      let docs: DocsMovie[] = [
        {
          id: 'doc1',
          data: () => ({
            imdbID: '1',
            isFavorite: true,
            Poster: 'p1',
            Title: 'title1',
            Type: 'type1',
            Year: '1',
          }),
        },
        {
          id: 'doc2',
          data: () => ({
            imdbID: '2',
            isFavorite: true,
            Poster: 'p2',
            Title: 'title2',
            Type: 'type2',
            Year: '2',
          }),
        },
      ];
      beforeEach(() => {
        mockAuthService.uid.mockReturnValue('user1');
        mockCollection.mockReturnValue('fake-reference');
        mockGetDocs.mockResolvedValue({ docs });
      });
      it('should call collection with correct arguments', () => {
        favoriteService.getFavorites().subscribe();
        expect(mockCollection).toHaveBeenCalledWith(expect.anything(), `users/user1/favorites`);
      });
      it('should call getDocs with correct arguments', () => {
        favoriteService.getFavorites().subscribe();
        expect(mockGetDocs).toHaveBeenCalledWith('fake-reference');
      });
      it('should return FavoriteMovie Observable ', async () => {
        const favoriteMovies = await firstValueFrom(favoriteService.getFavorites());
        const expectedDocs = docs.map((d) => ({ docId: d.id, ...d.data() }) as FavoriteMovie);
        expect(favoriteMovies).toEqual(expectedDocs);
      });
    });
    describe('when there is no userId', () => {
      it('should throw an error with expected message', async () => {
        mockAuthService.uid.mockReturnValue(null);
        await expect(firstValueFrom(favoriteService.getFavorites())).rejects.toThrow(
          '[FavoriteService]: Cannot resolve path. User is not authenticated.',
        );
      });
    });
  });
  describe('addFavorite', () => {
    const movie: OmdbMovieSearch = {
      imdbID: '1',
      isFavorite: true,
      Poster: 'p1',
      Title: 'title1',
      Type: 'type1',
      Year: '1',
    };
    describe('when there is a userId', () => {
      beforeEach(() => {
        mockAuthService.uid.mockReturnValue('user1');
      });
      it('should call collection with correct parameters', () => {
        favoriteService.addFavorite(movie);
        expect(collection).toHaveBeenCalledWith(expect.anything(), `users/user1/favorites`);
      });
      it('should call addDoc with correct parameters', () => {
        favoriteService.addFavorite(movie);
        expect(addDoc).toHaveBeenCalledWith(expect.anything(), movie);
      });
      it('should return the DocumentReference from addDoc', async () => {
        const docData = { id: 'doc1', path: 'users/user1/favorites/doc1' };
        mockAddDoc.mockResolvedValue(docData);
        const returnedDocdata = await firstValueFrom(favoriteService.addFavorite(movie));

        expect(returnedDocdata).toEqual(docData);
      });
    });
    describe('when there is no userId', () => {
      it('should throw error', async () => {
        mockAuthService.uid.mockReturnValue(null);
        await expect(firstValueFrom(favoriteService.addFavorite(movie))).rejects.toThrow(
          '[FavoriteService]: Cannot resolve path. User is not authenticated.',
        );
      });
    });
  });

  describe('removeFavorite', () => {
    describe('when there is a userId', () => {
      beforeEach(() => {
        mockAuthService.uid.mockReturnValue('user1');
        mockDoc.mockReturnValue({
          converter: null,
          type: 'document',
          id: 'doc1',
        });
        mockDeleteDoc.mockResolvedValue(undefined);
      });
      it('should call doc with correct parameters', () => {
        favoriteService.removeFavorite('doc1');
        expect(mockDoc).toHaveBeenCalledWith(expect.anything(), `users/user1/favorites/doc1`);
      });

      it('should call deleteDoc with docReference', () => {
        favoriteService.removeFavorite('doc1');
        expect(mockDeleteDoc).toHaveBeenCalledWith({
          converter: null,
          type: 'document',
          id: 'doc1',
        });
      });
    });
    describe('when there is no userId', () => {
      it('should throw error', async () => {
        mockAuthService.uid.mockReturnValue(null);
        await expect(firstValueFrom(favoriteService.removeFavorite('doc1'))).rejects.toThrow(
          '[FavoriteService]: Cannot resolve path. User is not authenticated.',
        );
      });
    });
  });
});
