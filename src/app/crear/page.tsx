"use client";

import { useRouter } from "next/navigation";

import ActorForm, {
  ActorFormData,
} from "../components/ActorForm";

import {
  CreateActorInput,
  useActors,
} from "../hooks/useActors";

export default function CrearActorPage() {
  const router = useRouter();

  const { createActor } = useActors();

  const handleCreate = (data: ActorFormData) => {
    const actor: CreateActorInput = {
      name: data.name,
      photo: data.photo,
      nationality: data.nationality,
      birthDate: data.birthDate,
      biography: data.biography,
    };

    createActor(actor);

    router.push("/actors");
  };

  const handleCancel = () => {
    router.push("/actors");
  };

  return (
    <main className="mx-auto max-w-3xl p-6">
      <ActorForm
        actor={null}
        onSubmit={handleCreate}
        onCancel={handleCancel}
      />
    </main>
  );
}
