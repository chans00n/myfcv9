export default function HomePage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      fontFamily: 'system-ui, sans-serif' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Hello World</h1>
        <p style={{ marginTop: '1rem' }}>This is a test page</p>
        <div style={{ marginTop: '2rem' }}>
          <a 
            href="/sign-in" 
            style={{ 
              backgroundColor: 'blue', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '0.25rem', 
              textDecoration: 'none' 
            }}
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
} 