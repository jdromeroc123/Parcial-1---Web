"use client";

import { useCallback, useEffect, useState } from "react";

export interface Prize {
  id: string;
  name: string;
}

export type CreatePrizeInput = Omit<Prize, "id">;

export type UpdatePrizeInput = Partial<Omit<Prize, "id">>;

interface UsePrizesReturn {
  Prizees: Prize[];
  loading: boolean;
  error: string | null;

  getPrize: (id: string) => Prize | undefined;
  createPrize: (data: CreatePrizeInput) => Prize;
  updatePrize: (id: string, data: UpdatePrizeInput) => Prize | null;
  deletePrize: (id: string) => boolean;
}

const STORAGE_KEY = "Prizes";

export function usePrizes(): UsePrizesReturn {
  const [Prizees, setPrizees] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Inicialización:
   *
   * 1. Intentamos obtener los Prizees de localStorage.
   * 2. Si existen, usamos esos datos.
   * 3. Si no existen, hacemos GET a la API.
   */
  useEffect(() => {
    let isMounted = true;

    const initializePrizes = async () => {
      try {

        const storedPrizes = localStorage.getItem(STORAGE_KEY);

        if (storedPrizes) {
          const Prizes: Prize[] = JSON.parse(storedPrizes);

          if (isMounted) {
            setPrizees(Prizes);
          }

          return;
        }
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify([])
          );
      } catch (error) {
        console.error("Error cargando Prizees:", error);

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

    initializePrizes();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Obtener un Prize
   */
  const getPrize = useCallback(
    (id: string) => {
      return Prizees.find((Prize) => Prize.id === id);
    },
    [Prizees]
  );

  /**
   * Crear Prize - LOCAL
   */
  const createPrize = useCallback(
    (data: CreatePrizeInput): Prize => {
      const newPrize: Prize = {
        id: crypto.randomUUID(),
        ...data,
      };

      setPrizees((currentPrizes) => {
        const updatedPrizes = [
          ...currentPrizes,
          newPrize,
        ];

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedPrizes)
        );

        return updatedPrizes;
      });

      return newPrize;
    },
    []
  );

  /**
   * Actualizar Prize - LOCAL
   */
  const updatePrize = useCallback(
    (id: string, data: UpdatePrizeInput): Prize | null => {
      let updatedPrize: Prize | null = null;

      setPrizees((currentPrizes) => {
        const updatedPrizes = currentPrizes.map((Prize) => {
          if (Prize.id !== id) {
            return Prize;
          }

          updatedPrize = {
            ...Prize,
            ...data,
            id: Prize.id,
          };

          return updatedPrize;
        });

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedPrizes)
        );

        return updatedPrizes;
      });

      return updatedPrize;
    },
    []
  );

  /**
   * Eliminar Prize - LOCAL
   */
  const deletePrize = useCallback((id: string): boolean => {
    let deleted = false;

    setPrizees((currentPrizes) => {
      const updatedPrizes = currentPrizes.filter(
        (Prize) => Prize.id !== id
      );

      deleted =
        updatedPrizes.length !== currentPrizes.length;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedPrizes)
      );

      return updatedPrizes;
    });

    return deleted;
  }, []);

  return {
    Prizees,
    loading,
    error,
    getPrize,
    createPrize,
    updatePrize,
    deletePrize,
  };
}
