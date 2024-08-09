import prisma from '../db/db';

export type CreateMovieParam = {
  title: string;
  year: string;
  rated: string | undefined;
  genre: string | undefined;
  imdbRating: string | undefined;
  poster: string;
  userId: string;
};
class MoviesService {
  constructor() {}

  async createMovie({ title, year, rated, genre, imdbRating, poster, userId }: CreateMovieParam) {
    return prisma?.movie.create({
      data: {
        title,
        year,
        rated,
        genre,
        imdbRating,
        poster,
        userId,
      },
    });
  }

  async updateMovie({ title, year, rated, genre, imdbRating, poster, userId, id }: CreateMovieParam & { id: string }) {
    return prisma?.movie.update({
      where: {
        id: id,
      },
      data: {
        title,
        year,
        rated,
        genre,
        imdbRating,
        poster,
        userId,
      },
    });
  }

  async getAllMovies({
    userId,
    query,
    genre,
    pageSize,
    offset,
  }: {
    userId: string;
    query?: string;
    genre?: string;
    pageSize: number;
    offset: number;
  }) {
    const filter: any = { userId };

    if (query && query.trim() !== '') {
      filter.AND = [
        {
          title: { contains: query, mode: 'insensitive' },
        },
      ];
    }
    if (genre && genre.trim() !== '_') {
      if (!filter.AND) filter.AND = [];

      filter.AND.push({
        genre: { contains: genre, mode: 'insensitive' },
      });
    }

    const [items, total] = await prisma.$transaction([
      prisma.movie.findMany({
        where: filter,
        orderBy: { dateCreated: 'desc' },
        skip: offset,
        take: pageSize,
      }),

      prisma.movie.count({ where: filter }),
    ]);

    return { items, total };
  }
}

const createMoviesService = () => {
  return new MoviesService();
};

export type { MoviesService };
export default createMoviesService;
