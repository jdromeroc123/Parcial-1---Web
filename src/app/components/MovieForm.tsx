"use client";

import { FormEvent, useState } from "react";
import { Movie } from "../hooks/useMovies";
import { Actor, useActors } from "../hooks/useActors";
import { Prize, usePrizes } from "../hooks/usePrizes";

export type MovieFormData = Omit<Movie, "id">;

interface MovieFormProps {
  Movie?: Movie | null;
  onSubmit: (data: MovieFormData) => void;
  onCancel: () => void;
}

const emptyForm: MovieFormData = {
  title: "",
  poster: "",
  duration: 0,
  country: "",
  releaseDate: "",
  popularity: 0,
  actor: undefined,
  prizes: [],
};

export default function MovieForm({
  Movie = null,
  onSubmit,
  onCancel,
}: MovieFormProps) {
  const { actores, loading: actorsLoading } = useActors();
  const { Prizees, loading: prizesLoading } = usePrizes();

  const [formData, setFormData] = useState<MovieFormData>(() =>
    Movie
      ? {
          title: Movie.title,
          poster: Movie.poster,
          duration: Movie.duration,
          country: Movie.country,
          releaseDate: Movie.releaseDate,
          popularity: Movie.popularity,
          actor: Movie.actor,
          prizes: Movie.prizes ?? [],
        }
      : emptyForm
  );

  const [selectedActorId, setSelectedActorId] = useState<string>(
    Movie?.actor?.id ?? ""
  );

  const [selectedPrizeIds, setSelectedPrizeIds] = useState<string[]>(
    Movie?.prizes?.map((prize) => prize.id) ?? []
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof MovieFormData, string>>
  >({});

  const isEditing = Movie !== null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]:
        name === "duration" || name === "popularity"
          ? Number(value)
          : value,
    }));

    const field = name as keyof MovieFormData;

    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  };

  const handleActorChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const actorId = e.target.value;

    setSelectedActorId(actorId);

    const actor = actores.find(
      (item) => item.id === actorId
    );

    setFormData((current) => ({
      ...current,
      actor: actor ?? undefined,
    }));
  };

  const handlePrizeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setSelectedPrizeIds(selectedIds);

    const selectedPrizes = Prizees.filter((prize) =>
      selectedIds.includes(prize.id)
    );

    setFormData((current) => ({
      ...current,
      prizes: selectedPrizes,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<
      Record<keyof MovieFormData, string>
    > = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es obligatorio.";
    }

    if (!formData.country.trim()) {
      newErrors.country = "El país es obligatorio.";
    }

    if (!formData.releaseDate) {
      newErrors.releaseDate =
        "La fecha de lanzamiento es obligatoria.";
    }

    if (formData.duration <= 0) {
      newErrors.duration =
        "La duración debe ser mayor a 0.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const selectedActor = actores.find(
      (actor) => actor.id === selectedActorId
    );

    const selectedPrizes = Prizees.filter((prize) =>
      selectedPrizeIds.includes(prize.id)
    );

    onSubmit({
      title: formData.title.trim(),
      poster: formData.poster.trim(),
      duration: Number(formData.duration),
      country: formData.country.trim(),
      releaseDate: formData.releaseDate,
      popularity: Number(formData.popularity),
      actor: selectedActor,
      prizes: selectedPrizes,
    });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-5">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? "Editar película" : "Nueva película"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {isEditing
            ? "Modifica la información de la película."
            : "Completa la información de la nueva película."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Título
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej. Forrest Gump"
            className={`w-full rounded-lg border px-3 py-2.5 text-sm text-black outline-none focus:ring-2 ${
              errors.title
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
          />

          {errors.title && (
            <p className="mt-1 text-sm text-red-600">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="poster"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            URL del póster
          </label>

          <input
            id="poster"
            name="poster"
            type="url"
            value={formData.poster}
            onChange={handleChange}
            placeholder="https://ejemplo.com/poster.jpg"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="duration"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Duración (minutos)
            </label>

            <input
              id="duration"
              name="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm text-black outline-none focus:ring-2 ${
                errors.duration
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />

            {errors.duration && (
              <p className="mt-1 text-sm text-red-600">
                {errors.duration}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="popularity"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Popularidad
            </label>

            <input
              id="popularity"
              name="popularity"
              type="number"
              min="0"
              value={formData.popularity}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="country"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            País
          </label>

          <input
            id="country"
            name="country"
            type="text"
            value={formData.country}
            onChange={handleChange}
            placeholder="Ej. Estados Unidos"
            className={`w-full rounded-lg border px-3 py-2.5 text-sm text-black outline-none focus:ring-2 ${
              errors.country
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
          />

          {errors.country && (
            <p className="mt-1 text-sm text-red-600">
              {errors.country}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="releaseDate"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Fecha de lanzamiento
          </label>

          <input
            id="releaseDate"
            name="releaseDate"
            type="date"
            value={formData.releaseDate}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm text-black outline-none focus:ring-2 ${
              errors.releaseDate
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
          />

          {errors.releaseDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.releaseDate}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="actor"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Actor principal
          </label>

          <select
            id="actor"
            value={selectedActorId}
            onChange={handleActorChange}
            disabled={actorsLoading}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              {actorsLoading
                ? "Cargando actores..."
                : "Sin actor principal"}
            </option>

            {actores.map((actor: Actor) => (
              <option key={actor.id} value={actor.id}>
                {actor.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="prizes"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Premios
          </label>

          <select
            id="prizes"
            multiple
            value={selectedPrizeIds}
            onChange={handlePrizeChange}
            disabled={prizesLoading}
            className="min-h-32 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {prizesLoading ? (
              <option disabled>
                Cargando premios...
              </option>
            ) : Prizees.length === 0 ? (
              <option disabled>
                No hay premios disponibles
              </option>
            ) : (
              Prizees.map((prize: Prize) => (
                <option key={prize.id} value={prize.id}>
                  {prize.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            {isEditing
              ? "Guardar cambios"
              : "Crear película"}
          </button>
        </div>
      </form>
    </div>
  );
}
