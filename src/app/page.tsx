"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const irActores = () =>{
    router.replace("/actors");
  };

  const irCrear = () =>{
    router.replace("/crear");
  };
  const irPelicular = () =>{
    router.replace("/movies");
  };

    const irPremios = () =>{
    router.replace("/prizes");
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <main className="flex flex-col items-center gap-4 rounded-2xl bg-white p-10 shadow-md">
        <p className="text-xl font-semibold text-black">Ir a:</p>

        <div className="flex gap-3">
          <button
            onClick={irActores}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Ver Actores
          </button>

          <button
            onClick={irCrear}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Crear Actor
          </button>

          <button
            onClick={irPelicular}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Ver Pelicula
          </button>

          <button
            onClick={irPremios}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Ver premios
          </button>
        </div>
      </main>
    </div>
  );
}
