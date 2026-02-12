'use client';

import { useState } from 'react';
import RoadLoader from '@/components/ui/road-loader';
import RoadError from '@/components/ui/road-error';
import { Button } from '@/components/ui/button';

export default function TestLoaderPage() {
  const [view, setView] = useState<'loading' | 'error'>('loading');

  return (
    <div className="container mx-auto max-w-2xl space-y-8 px-4 py-20">
      {/* 헤더 및 컨트롤러 */}
      <div className="flex flex-col items-center justify-between gap-4 border-b pb-6 sm:flex-row">
        <h1 className="text-2xl font-bold text-gray-800">컴포넌트 테스트</h1>

        <div className="flex gap-2">
          <Button
            variant={view === 'loading' ? 'default' : 'outline'}
            onClick={() => setView('loading')}
            className={view === 'loading' ? 'bg-[var(--color-ongil-teal)]' : ''}
          >
            로딩 (Loading)
          </Button>
          <Button
            variant={view === 'error' ? 'destructive' : 'outline'}
            onClick={() => setView('error')}
          >
            에러 (Error)
          </Button>
        </div>
      </div>

      {/* 미리보기 영역 */}
      <div className="relative flex min-h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border bg-white shadow-sm">
        {/* 상단 라벨 */}
        <div className="absolute top-4 left-6 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
          Preview: {view === 'loading' ? 'loading.tsx' : 'error.tsx'}
        </div>

        {/* 컴포넌트 렌더링 */}
        {view === 'loading' ? (
          <RoadLoader />
        ) : (
          <RoadError
            error={
              Object.assign(new Error('테스트 에러입니다.'), {
                digest: 'ERR_CONNECTION_REFUSED',
              }) as Error & { digest?: string }
            }
            reset={() => {
              alert('🔄 다시 시도(Reset) 함수가 호출되었습니다.');
              setView('loading');
            }}
          />
        )}
      </div>
    </div>
  );
}
