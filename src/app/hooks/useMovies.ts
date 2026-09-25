"use client";

import { useCallback, useEffect, useState } from "react";
import { Actor } from '../hooks/useActors';
import { Prize } from '../hooks/usePrizes';

export interface Movie {
  id: string;
  title: string;
  poster: string;
  duration: number;
  country: string;
  releaseDate: string;
  popularity: number;
  actor?: Actor;
  prizes?: Prize[];
}

export type CreateMovieInput = Omit<Movie, "id">;

export type UpdateMovieInput = Partial<Omit<Movie, "id">>;

interface UseMoviesReturn {
  Moviees: Movie[];
  loading: boolean;
  error: string | null;

  getMovie: (id: string) => Movie | undefined;
  createMovie: (data: CreateMovieInput) => Movie;
  updateMovie: (id: string, data: UpdateMovieInput) => Movie | null;
  deleteMovie: (id: string) => boolean;
}

const STORAGE_KEY = "Movies";

export function useMovies(): UseMoviesReturn {
  const [Moviees, setMoviees] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Inicialización:
   *
   * 1. Intentamos obtener los Moviees de localStorage.
   * 2. Si existen, usamos esos datos.
   * 3. Si no existen, hacemos GET a la API.
   */
  useEffect(() => {
    let isMounted = true;

    const initializeMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedMovies = localStorage.getItem(STORAGE_KEY);

        if (storedMovies) {
          const Movies: Movie[] = JSON.parse(storedMovies);

          if (isMounted) {
            setMoviees(Movies);
          }

          return;
        }

        // No hay datos guardados.
        // Hacemos GET a la API.
        const response = await fetch(
          "http://localhost:3000/api/v1/Movies"
        );

        if (!response.ok) {
          throw new Error("Error al obtener Movies");
        }

        const data: Movie[] = await response.json();

        if (isMounted) {
          setMoviees(data);

          // Guardamos los Moviees iniciales.
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
          );
        }
      } catch (error) {
        console.error("Error cargando Moviees:", error);

        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Error desconocido"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Obtener un Movie
   */
  const getMovie = useCallback(
    (id: string) => {
      return Moviees.find((Movie) => Movie.id === id);
    },
    [Moviees]
  );

  /**
   * Crear Movie - LOCAL
   */
  const createMovie = useCallback(
    (data: CreateMovieInput): Movie => {
      const newMovie: Movie = {
        id: crypto.randomUUID(),
        ...data,
      };

      setMoviees((currentMovies) => {
        const updatedMovies = [
          ...currentMovies,
          newMovie,
        ];

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedMovies)
        );

        return updatedMovies;
      });

      return newMovie;
    },
    []
  );

  /**
   * Actualizar Movie - LOCAL
   */
  const updateMovie = useCallback(
    (id: string, data: UpdateMovieInput): Movie | null => {
      let updatedMovie: Movie | null = null;

      setMoviees((currentMovies) => {
        const updatedMovies = currentMovies.map((Movie) => {
          if (Movie.id !== id) {
            return Movie;
          }

          updatedMovie = {
            ...Movie,
            ...data,
            id: Movie.id,
          };

          return updatedMovie;
        });

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedMovies)
        );

        return updatedMovies;
      });

      return updatedMovie;
    },
    []
  );

  /**
   * Eliminar Movie - LOCAL
   */
  const deleteMovie = useCallback((id: string): boolean => {
    let deleted = false;

    setMoviees((currentMovies) => {
      const updatedMovies = currentMovies.filter(
        (Movie) => Movie.id !== id
      );

      deleted =
        updatedMovies.length !== currentMovies.length;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedMovies)
      );

      return updatedMovies;
    });

    return deleted;
  }, []);

  return {
    Moviees,
    loading,
    error,
    getMovie,
    createMovie,
    updateMovie,
    deleteMovie,
  };
}
