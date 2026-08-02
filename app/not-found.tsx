"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="
      min-h-screen
      flex items-center justify-center
    ">
      <section className="
        text-center
        max-w-sm
      ">
        <div className="font-display-en text-display">
          404
        </div>

        <h2 className="mt-4 text-h2">
          Page not found
        </h2>

        <p className="mt-2 text-body text-foreground-secondary">
          Нам очень жаль, но мы не смогли найти эту страницу.
        </p>

        <button
          className="
            inline-block mt-6
            rounded-lg
            px-5 py-2
            bg-primary
            text-background
            hover:cursor-pointer
          "
          onClick={() => router.push("/chat")}
        >
          На главную
        </button>
      </section>
    </main>
  );
}