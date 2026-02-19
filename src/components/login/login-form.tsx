'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function LoginForm() {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const authError = searchParams.get('error');
  const handleSocialLogin = (provider: 'kakao' | 'google') => {
    setIsLoading(true);
    const callbackUrl = `${window.location.origin}/auth/callback/${provider}`;
    let authUrl = '';
    if (provider === 'kakao') {
      const CLIENT_ID = process.env.NEXT_PUBLIC_AUTH_KAKAO_ID;
      if (!CLIENT_ID) {
        console.error('Missing NEXT_PUBLIC_AUTH_KAKAO_ID');
        alert('카카오 로그인 설정이 누락되었습니다.');
        setIsLoading(false);
        return;
      }
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: callbackUrl,
        response_type: 'code',
      });
      authUrl = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
    } else if (provider === 'google') {
      const CLIENT_ID = process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID;
      if (!CLIENT_ID) {
        console.error('Missing NEXT_PUBLIC_AUTH_GOOGLE_ID');
        alert('구글 로그인 설정이 누락되었습니다.');
        setIsLoading(false);
        return;
      }
      const SCOPE = 'openid email profile';
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: callbackUrl,
        response_type: 'code',
        scope: SCOPE,
      });
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }
    window.location.href = authUrl;
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-12 sm:px-6 lg:px-8"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="absolute inset-0 bg-white/60" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 flex flex-col items-center gap-0">
          <Image src="/ongil.svg" alt="온길" width={165} height={50} priority />
          <div className="h-[40px]" />
          <Image src="/gil.svg" alt="길" width={82} height={27} priority />
          <p className="font-pretendard mt-[80px] mb-5 text-center text-[24px] font-bold text-black">
            온길과 함께 걷는 편안한 쇼핑길
          </p>
        </div>

        {authError && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-center text-sm text-red-500">
            Authentication failed. Please try again.
          </div>
        )}

        <div className="mx-auto w-full max-w-[320px] space-y-4">
          <button
            onClick={() => handleSocialLogin('kakao')}
            disabled={isLoading}
            className="font-pretendard flex w-full items-center justify-center gap-3 rounded-lg bg-[#FEE500] px-4 py-4 text-[24px] font-bold text-black shadow-sm transition-colors hover:bg-[#FDD835] focus:outline-none disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M12 3C5.373 3 0 6.697 0 11.258c0 2.925 2.228 5.494 5.61 6.836-.254.936-1.077 3.822-1.22 4.414-.142.593.24.606.52.41 1.08-.76 4.755-3.23 5.474-3.722.533.076 1.08.115 1.638.115 6.627 0 12-3.697 12-8.258C24 6.697 18.627 3 12 3z" />
            </svg>
            카카오로 시작하기
          </button>

          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="font-pretendard flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-4 text-[24px] font-bold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            구글로 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
