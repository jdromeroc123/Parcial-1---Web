"use client";

import { FormEvent, useState } from "react";
import { Actor } from "../hooks/useActors";

export type ActorFormData = Omit<Actor, "id">;

interface ActorFormProps {
  actor?: Actor | null;
  onSubmit: (data: ActorFormData) => void;
  onCancel: () => void;
}

const emptyForm: ActorFormData = {
  name: "",
  photo: "",
  nationality: "",
  birthDate: "",
  biography: "",
};

export default function ActorForm({
  actor = null,
  onSubmit,
  onCancel,
}: ActorFormProps) {
  const [formData, setFormData] = useState<ActorFormData>(() => {
    if (!actor) {
      return emptyForm;
    }

    return {
      name: actor.name,
      photo: actor.photo,
      nationality: actor.nationality,
      birthDate: actor.birthDate,
      biography: actor.biography,
    };
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ActorFormData, string>>
  >({});

  const isEditing = actor !== null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    const field = name as keyof ActorFormData;

    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<
      Record<keyof ActorFormData, string>
    > = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio.";
    }

    if (!formData.nationality.trim()) {
      newErrors.nationality =
        "La nacionalidad es obligatoria.";
    }

    if (!formData.birthDate) {
      newErrors.birthDate =
        "La fecha de nacimiento es obligatoria.";
    }

    if (!formData.biography.trim()) {
      newErrors.biography =
        "La biografía es obligatoria.";
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

    const data: ActorFormData = {
      name: formData.name.trim(),
      photo: formData.photo.trim(),
      nationality: formData.nationality.trim(),
      birthDate: formData.birthDate,
      biography: formData.biography.trim(),
    };

    onSubmit(data);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-5">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? "Editar actor" : "Nuevo actor"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {isEditing
            ? "Modifica la información del actor."
            : "Completa la información del nuevo actor."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6"
      >
        {/* Nombre */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700 text-black"
          >
            Nombre
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej. Tom Hanks"
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 text-black ${
              errors.name
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        {/* Foto */}
        <div>
          <label
            htmlFor="photo"
            className="mb-2 block text-sm font-medium text-gray-700 text-black"
          >
            URL de la foto
          </label>

          <input
            id="photo"
            name="photo"
            type="url"
            value={formData.photo}
            onChange={handleChange}
            placeholder="https://ejemplo.com/foto.jpg"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black"
          />
        </div>

        {/* Nacionalidad */}
        <div>
          <label
            htmlFor="nationality"
            className="mb-2 block text-sm font-medium text-gray-700 text-black"
          >
            Nacionalidad
          </label>

          <input
            id="nationality"
            name="nationality"
            type="text"
            value={formData.nationality}
            onChange={handleChange}
            placeholder="Ej. Estadounidense"
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 text-black ${
              errors.nationality
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
          />

          {errors.nationality && (
            <p className="mt-1 text-sm text-red-600">
              {errors.nationality}
            </p>
          )}
        </div>

        {/* Fecha de nacimiento */}
        <div>
          <label
            htmlFor="birthDate"
            className="mb-2 block text-sm font-medium text-gray-700 text-black"
          >
            Fecha de nacimiento
          </label>

          <input
            id="birthDate"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 text-black ${
              errors.birthDate
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
          />

          {errors.birthDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.birthDate}
            </p>
          )}
        </div>

        {/* Biografía */}
        <div>
          <label
            htmlFor="biography"
            className="mb-2 block text-sm font-medium text-gray-700 text-black"
          >
            Biografía
          </label>

          <textarea
            id="biography"
            name="biography"
            value={formData.biography}
            onChange={handleChange}
            rows={5}
            placeholder="Escribe una breve biografía..."
            className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 text-black ${
              errors.biography
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
          />

          {errors.biography && (
            <p className="mt-1 text-sm text-red-600">
              {errors.biography}
            </p>
          )}
        </div>

        {/* Botones */}
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
              : "Crear actor"}
          </button>
        </div>
      </form>
    </div>
  );
}