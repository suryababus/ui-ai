"use client"; // Error components must be Client Components

import { emitEvent } from "@/lib/firebase";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    emitEvent({
      event: "error",
      data: {
        message: error.message,
        digest: error.digest,
      },
    });
  }, [error]);

  return (
    <div className="flex items-center justify-center flex-1 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <img
          src="/cry.gif"
          alt="Error Image"
          className="mx-auto mb-4 w-24 h-24 object-cover rounded-full"
        />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Something Went Wrong
        </h2>
        <p className="text-gray-600 mb-4">
          We encountered an unexpected error. Please try again later.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
