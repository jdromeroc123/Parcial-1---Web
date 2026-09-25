"use client";

import { useState } from "react";

import { Movie, UpdateMovieInput, useMovies } from "../hooks/useMovies";
import MovieList from "../components/MovieList";
import MovieForm from "../components/MovieForm";

export default function Movies() {
  const {
    Moviees,
    loading,
    error,
    updateMovie,
    deleteMovie,
  } = useMovies();

  const [selectedMovie, setSelectedMovie] =
    useState<Movie | null>(null);

  const [showForm, setShowForm] = useState(false);

  /**
   * Abrir formulario para editar un Movie
   */
  const handleEdit = (id: string) => {
    const Movie = Moviees.find(
      (Movie) => Movie.id === id
    );

    if (!Movie) {
      return;
    }

    setSelectedMovie(Movie);
    setShowForm(true);
  };

  /**
   * Guardar cambios del formulario
   */
  const handleFormSubmit = (
    data: UpdateMovieInput
  ) => {
    if (!selectedMovie) {
      return;
    }

    updateMovie(selectedMovie.id, data);

    setShowForm(false);
    setSelectedMovie(null);
  };

  /**
   * Cancelar edición
   */
  const handleCancelEdit = () => {
    setShowForm(false);
    setSelectedMovie(null);
  };

  /**
   * Eliminar Movie
   */
  const handleDelete = (id: string) => {
    const Movie = Moviees.find(
      (Movie) => Movie.id === id
    );

    if (!Movie) {
      return;
    }

    const confirmed = window.confirm(
      `¿Estás seguro de eliminar a ${Movie.title}?`
    );

    if (!confirmed) {
      return;
    }

    deleteMovie(id);
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-600">
            Cargando Moviees...
          </p>
        </div>
      </main>
    );
  }

  /*
   * Error
   */
  if (error) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-700">
            Error en la carga de Moviees
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      {showForm && selectedMovie ? (
        <MovieForm
        key={selectedMovie.id}
        Movie={selectedMovie}
        onSubmit={handleFormSubmit}
        onCancel={handleCancelEdit}
        />

      ) : (
        <MovieList
          Movies={Moviees}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}