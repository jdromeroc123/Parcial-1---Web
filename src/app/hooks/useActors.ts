"use client";

import { useCallback, useEffect, useState } from "react";

export interface Actor {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
}

export type CreateActorInput = Omit<Actor, "id">;

export type UpdateActorInput = Partial<Omit<Actor, "id">>;

interface UseActorsReturn {
  actores: Actor[];
  loading: boolean;
  error: string | null;

  getActor: (id: string) => Actor | undefined;
  createActor: (data: CreateActorInput) => Actor;
  updateActor: (id: string, data: UpdateActorInput) => Actor | null;
  deleteActor: (id: string) => boolean;
}

const STORAGE_KEY = "actors";

export function useActors(): UseActorsReturn {
  const [actores, setActores] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Inicialización:
   *
   * 1. Intentamos obtener los actores de localStorage.
   * 2. Si existen, usamos esos datos.
   * 3. Si no existen, hacemos GET a la API.
   */
  useEffect(() => {
    let isMounted = true;

    const initializeActors = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedActors = localStorage.getItem(STORAGE_KEY);

        if (storedActors) {
          const actors: Actor[] = JSON.parse(storedActors);

          if (isMounted) {
            setActores(actors);
          }

          return;
        }

        // No hay datos guardados.
        // Hacemos GET a la API.
        const response = await fetch(
          "http://localhost:3000/api/v1/actors"
        );

        if (!response.ok) {
          throw new Error("Error al obtener actores");
        }

        const data: Actor[] = await response.json();

        if (isMounted) {
          setActores(data);

          // Guardamos los actores iniciales.
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
          );
        }
      } catch (error) {
        console.error("Error cargando actores:", error);

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

    initializeActors();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Obtener un actor
   */
  const getActor = useCallback(
    (id: string) => {
      return actores.find((actor) => actor.id === id);
    },
    [actores]
  );

  /**
   * Crear actor - LOCAL
   */
  const createActor = useCallback(
    (data: CreateActorInput): Actor => {
      const newActor: Actor = {
        id: crypto.randomUUID(),
        ...data,
      };

      setActores((currentActors) => {
        const updatedActors = [
          ...currentActors,
          newActor,
        ];

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedActors)
        );

        return updatedActors;
      });

      return newActor;
    },
    []
  );

  /**
   * Actualizar actor - LOCAL
   */
  const updateActor = useCallback(
    (id: string, data: UpdateActorInput): Actor | null => {
      let updatedActor: Actor | null = null;

      setActores((currentActors) => {
        const updatedActors = currentActors.map((actor) => {
          if (actor.id !== id) {
            return actor;
          }

          updatedActor = {
            ...actor,
            ...data,
            id: actor.id,
          };

          return updatedActor;
        });

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedActors)
        );

        return updatedActors;
      });

      return updatedActor;
    },
    []
  );

  /**
   * Eliminar actor - LOCAL
   */
  const deleteActor = useCallback((id: string): boolean => {
    let deleted = false;

    setActores((currentActors) => {
      const updatedActors = currentActors.filter(
        (actor) => actor.id !== id
      );

      deleted =
        updatedActors.length !== currentActors.length;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedActors)
      );

      return updatedActors;
    });

    return deleted;
  }, []);

  return {
    actores,
    loading,
    error,
    getActor,
    createActor,
    updateActor,
    deleteActor,
  };
}
