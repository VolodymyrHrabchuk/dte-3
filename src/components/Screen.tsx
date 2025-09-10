import { PropsWithChildren } from "react";
import AppHeader from "./AppHeader";

type Props = {
  title?: string;
  onBack?: () => void;
  progress?: number;
  showProgress?: boolean; // ⬅️ новое
};

export default function Screen({
  title = "Discover",
  onBack,
  progress = 0,
  showProgress = true,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className='min-h-dvh relative text-white'>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[url('/bg.png')] bg-cover bg-center"
      />

      <div className='max-w-md mx-auto px-6 pt-12'>
        <AppHeader title={title} onBack={onBack} />

        {/* progress */}
        {showProgress && (
          <div className='mt-4'>
            <div className='w-full h-2 rounded-full bg-white/10 overflow-hidden'>
              <div
                className='h-full bg-white rounded-full transition-all duration-500 ease-in-out shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {children}
        <div className='h-24' />
      </div>
    </div>
  );
}
