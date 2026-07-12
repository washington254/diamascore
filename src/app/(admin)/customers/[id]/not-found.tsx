import Link from "next/link";

export default function CustomerNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white/90">
          Customer Not Found
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          The customer you're looking for doesn't exist.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/customers"
            className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white hover:bg-brand-600"
          >
            Back to Customers
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
