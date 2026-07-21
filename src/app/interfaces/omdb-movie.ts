export interface OmdbMovieSearch {
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
}
export interface OmdbMovieResponse {
  Response: string;
  totalResult: string;
  Search: OmdbMovieSearch[];
}
