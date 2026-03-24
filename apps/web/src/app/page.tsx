export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4">
          PMS - Personal Management System
        </h1>
        <p className="text-lg text-zinc-600 mb-8">
          Unified personal data platform with AI-powered insights
        </p>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-primary-600 mb-2">
            Welcome to PMS
          </h2>
          <p className="text-zinc-700">
            Your personal management platform is ready. More features coming soon.
          </p>
        </div>
      </div>
    </main>
  );
}
