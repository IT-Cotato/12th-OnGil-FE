'use client';

import { useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/ui/loading-indicator';

export default function OAuthCallbackPage() {
  const params = useParams<{ provider: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const processed = useRef(false); // Prevent React 18/19 double-fire

  useEffect(() => {
    const code = searchParams.get('code');
    const provider = params.provider; // "google" or "kakao"

    if (code && provider && !processed.current) {
      processed.current = true;

      signIn('external-oauth', {
        provider,
        code,
        redirect: false,
      }).then((result) => {
        if (result?.ok) {
          window.location.href = '/';
        } else {
          console.error('Login Failed', result?.error);
          router.replace('/login?error=auth_failed');
        }
      });
    }
  }, [searchParams, params, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center px-4">
      <LoadingIndicator />
    </div>
  );
}
