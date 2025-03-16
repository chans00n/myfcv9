import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="font-bold">MYFC</div>
          <div className="ml-auto flex items-center space-x-4">
            <Link 
              href="/sign-in"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>
      <main className="overflow-x-hidden">
        <section className="py-12 md:py-20">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="text-center lg:col-span-6 lg:text-left flex flex-col justify-center">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  Build Your SaaS
                  <span className="block text-primary">Faster Than Ever</span>
                </h1>
                <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-lg lg:text-base xl:text-lg max-w-prose mx-auto lg:mx-0">
                  Launch your SaaS product in record time with our powerful,
                  ready-to-use template. Packed with modern technologies and
                  essential integrations.
                </p>
                <div className="mt-8 flex justify-center lg:justify-start">
                  <Link
                    href="https://vercel.com/templates/next.js/next-js-saas-starter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white hover:bg-gray-100 text-black border border-gray-200 text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4"
                  >
                    Deploy your own
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4 sm:h-5 sm:w-5">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="mt-8 lg:mt-0 lg:col-span-6 flex items-center justify-center">
                <div className="w-full max-w-md lg:max-w-none bg-black text-white p-4 rounded-md">
                  <pre className="text-sm">
                    <code>
                      $ npx create-next-app --example saas-starter my-saas-app
                      <br />
                      <br />
                      Creating a new Next.js app...
                      <br />
                      <br />
                      ✅ Success! Your SaaS starter is ready.
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white w-full">
          <div className="container px-4 mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Key Features</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">
                  React & Next.js
                </h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Built with the latest React and Next.js features for optimal
                  performance and developer experience.
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">
                  Stripe Integration
                </h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Ready-to-use Stripe integration for handling subscriptions and
                  payments with minimal setup.
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">
                  Database & Auth
                </h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Includes authentication and database setup with secure user
                  management and team collaboration.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Ready to launch your SaaS?
                </h2>
                <p className="mt-3 text-base sm:text-lg text-muted-foreground">
                  Our template provides everything you need to get your SaaS up
                  and running quickly. Don't waste time on boilerplate - focus on
                  what makes your product unique.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
                <Link 
                  href="https://github.com/nextjs/saas-starter" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white hover:bg-gray-100 text-black border border-gray-200 text-base sm:text-xl px-8 py-4 sm:px-12 sm:py-6"
                >
                  View the code
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-5 w-5 sm:h-6 sm:w-6">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 