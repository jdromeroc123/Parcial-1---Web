"use client";

import { useState } from "react";

import { Actor, UpdateActorInput, useActors } from "../hooks/useActors";
import ActorList from "../components/ActorList";
import ActorForm from "../components/ActorForm";

export default function Actors() {
  const {
    actores,
    loading,
    error,
    updateActor,
    deleteActor,
  } = useActors();

  const [selectedActor, setSelectedActor] =
    useState<Actor | null>(null);

  const [showForm, setShowForm] = useState(false);

  /**
   * Abrir formulario para editar un actor
   */
  const handleEdit = (id: string) => {
    const actor = actores.find(
      (actor) => actor.id === id
    );

    if (!actor) {
      return;
    }

    setSelectedActor(actor);
    setShowForm(true);
  };

  /**
   * Guardar cambios del formulario
   */
  const handleFormSubmit = (
    data: UpdateActorInput
  ) => {
    if (!selectedActor) {
      return;
    }

    updateActor(selectedActor.id, data);

    setShowForm(false);
    setSelectedActor(null);
  };

  /**
   * Cancelar edición
   */
  const handleCancelEdit = () => {
    setShowForm(false);
    setSelectedActor(null);
  };

  /**
   * Eliminar actor
   */
  const handleDelete = (id: string) => {
    const actor = actores.find(
      (actor) => actor.id === id
    );

    if (!actor) {
      return;
    }

    const confirmed = window.confirm(
      `¿Estás seguro de eliminar a ${actor.name}?`
    );

    if (!confirmed) {
      return;
    }

    deleteActor(id);
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-600">
            Cargando actores...
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
            Error en la carga de actores
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
      {showForm && selectedActor ? (
        <ActorForm
        key={selectedActor.id}
        actor={selectedActor}
        onSubmit={handleFormSubmit}
        onCancel={handleCancelEdit}
        />

      ) : (
        <ActorList
          actors={actores}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}