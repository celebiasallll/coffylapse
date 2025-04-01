import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DebugClaimPage() {
  const router = useRouter();
  
  // Automatically redirect to home page
  useEffect(() => {
    router.push('/');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-xl font-bold mb-2">Redirecting...</h1>
        <p>This debug page is no longer available.</p>
      </div>
    </div>
  );
}
