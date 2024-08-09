import prisma from '../db/db';
import { compare } from 'bcryptjs';
import { hashPassword } from '../utils/auth';
import { Prisma } from '@prisma/client';
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
  async getAllMovies(userId: string) {
    return prisma?.movie.findMany({
      where: {
        userId,
      },
      orderBy: {
        dateCreated: 'desc',
      },
    });
  }
}

const createMoviesService = () => {
  return new MoviesService();
};
export type { MoviesService };
export default createMoviesService;
