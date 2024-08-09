type Search = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: 'movie' | 'series';
  Poster: string;
};

type SiteAssets = {
  Search: Search[];
  totalResults: string;
  Response: string;
};

type MovieDetail = {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Genre: string;
  imdbRating: string;
  Poster: string;
};

class MovieLookupService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'http://www.omdbapi.com/';
  }

  public async findMovieDetailsByQuery(query: string): Promise<MovieDetail[]> {
    try {
      const searchUrl = `${this.baseUrl}?s=${encodeURIComponent(query)}&type=movie&apikey=${this.apiKey}`;
      const searchResponse = await fetch(searchUrl);
      const searchData = (await searchResponse.json()) as SiteAssets;

      if (searchData.Response === 'False') {
        throw new Error('No movies found');
      }

      // Limit the results to the top 10 movies
      const movies = searchData.Search.slice(0, 10);

      const movieDetails = await Promise.all(
        movies.map(async (movie) => {
          const detailUrl = `${this.baseUrl}?i=${movie.imdbID}&apikey=${this.apiKey}`;
          const detailResponse = await fetch(detailUrl);
          const details = (await detailResponse.json()) as MovieDetail;

          // Construct a simplified movie object with necessary details
          const simpleDetails: MovieDetail = {
            imdbID: details.imdbID,
            Title: details.Title,
            Year: details.Year,
            Rated: details.Rated,
            Genre: details.Genre,
            imdbRating: details.imdbRating,
            Poster: await this.fetchHdPoster(details.imdbID, movie.Poster),
          };

          return simpleDetails;
        })
      );

      return movieDetails;
    } catch (error) {
      console.error('Failed to retrieve movie details:', error);
      throw error;
    }
  }

  private async fetchHdPoster(imdbID: string, fallbackPoster: string): Promise<string> {
    const hdPosterUrl = `https://img.omdbapi.com/?i=${imdbID}&h=800&apikey=${this.apiKey}`;
    try {
      const response = await fetch(hdPosterUrl);
      if (!response.ok) throw new Error('Failed to fetch HD poster');
      return hdPosterUrl;
    } catch (error) {
      // console.warn(`Falling back to standard poster for ${imdbID}: ${error}`);
      return fallbackPoster;
    }
  }
}
export type { MovieLookupService };
export const createMovieLookupService = () => {
  return new MovieLookupService(process.env.OMDB_KEY as string);
};
