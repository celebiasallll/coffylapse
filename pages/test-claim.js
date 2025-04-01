import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TestClaimPage() {
  const router = useRouter();
  
  // Automatically redirect to home page
  useEffect(() => {
    router.push('/');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md mx-auto bg-white rounded-md shadow-md p-4">
        <h1 className="text-xl font-bold mb-2">Redirecting...</h1>
        <p>This test page has been deprecated.</p>
      </div>
    </div>
  );
}
