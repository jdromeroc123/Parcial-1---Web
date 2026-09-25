import { Movie } from "../hooks/useMovies";
import { Prize } from "../hooks/usePrizes";

interface MovieListProps {
  Movies: Movie[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function MovieList({
  Movies,
  onEdit,
  onDelete,
}: MovieListProps) {
  if (Movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
          <svg
            className="h-6 w-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.5a7.5 7.5 0 110 15 7.5 7.5 0 010-15z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01"
            />
          </svg>
        </div>

        <h3 className="text-base font-semibold text-gray-900">
          No hay Movies
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Todavía no hay Movies registrados.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Listado de Movies
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {Movies.length}{" "}
              {Movies.length === 1 ? "Movie registrado" : "Moviees registrados"}
            </p>
          </div>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            {Movies.length}
          </span>
        </div>
      </div>

      {/* Lista */}
      <ul className="divide-y divide-gray-200">
        {Movies.map((Movie) => (
          <li
            key={Movie.id}
            className="p-6 transition-colors hover:bg-gray-50"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              {/* Información */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-4">

                  {/* Datos */}
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-gray-900">
                      {Movie.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500">
                      <span>
                        <strong className="font-medium text-gray-700">
                          Fecha Lanzamiento:
                        </strong>{" "}
                        {Movie.releaseDate}
                      </span>

                      <span className="hidden sm:inline">•</span>
                        
                      <span>
                        <strong className="font-medium text-gray-700">
                          Actor Principal:
                        </strong>{" "}
                        {Movie.actor ? Movie.actor.name : "No hay actor principal" }
                      </span>
                      <span>
                        <strong className="font-medium text-gray-700">
                        Premios:
                        </strong>{" "}
                        {Movie.prizes?.length
                        ? Movie.prizes.map((prize: Prize, index: number) => (
                            <span key={prize.id ?? index}>
                                {prize.name}
                                {index < Movie.prizes!.length - 1 && ", "}
                            </span>
                            ))
                        : "No hay premios"}
                        </span>
                    </div>
                  </div>
                </div>

              {/* Acciones */}
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(Movie.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-100"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.5-9.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                    />
                  </svg>
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(Movie.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-100"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-9 0h14"
                    />
                  </svg>
                  Eliminar
                </button>
              </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}