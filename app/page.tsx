import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Hello World</h1>
        <p className="mt-4">This is a test page</p>
        <div className="mt-8">
          <a 
            href="/sign-in" 
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
} 