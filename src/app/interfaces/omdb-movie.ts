export interface OmdbMovieSearch {
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
}
export interface OmdbMovieResponse {
  Response: string;
  totalResults: string;
  Search: OmdbMovieSearch[];
}
export interface FavoriteMovie extends OmdbMovieSearch {
  docId: string;
}
