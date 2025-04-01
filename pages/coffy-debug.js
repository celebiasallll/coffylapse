import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CoffyDebugPage() {
  const router = useRouter();
  
  // Automatically redirect to home page
  useEffect(() => {
    router.push('/');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-xl font-bold mb-2">Redirecting...</h1>
        <p>This debug tool has been removed.</p>
      </div>
    </div>
  );
}
