import LoadingIndicator from '@/components/ui/loading-indicator';

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoadingIndicator />
    </div>
  );
}
