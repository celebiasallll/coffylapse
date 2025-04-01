import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TestPage() {
  const router = useRouter();
  
  // Automatically redirect to home page
  useEffect(() => {
    router.push('/');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-coffee-dark">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-2">Redirecting...</h1>
        <p>This test page has been deprecated.</p>
      </div>
    </div>
  );
}
