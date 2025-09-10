"use client";
import Image from "next/image";

type Kind = "train" | "execute";

export default function UnlockModal({
  open,
  kind,
  onClose,
  onAction,
}: {
  open: boolean;
  kind: Kind | null;
  onClose: () => void;
  onAction: () => void;
}) {
  if (!open || !kind) return null;

  const title =
    kind === "train" ? "Train Section Unlocked!" : "Execute Section Unlocked!";


  const desc =
    kind === "train"
      ? "Track And Grow Your Personal Skills — Now Available In Your Dashboard."
      : "Set clear Execute to stay aligned and focused each day.";

  const cta = kind === "train" ? "Go to Train" : "Go to Execute";

  return (
    <div className='fixed inset-0 z-[999] flex items-center justify-center px-4'>
      <div className='absolute inset-0 bg-black/60' onClick={onClose} />
      <div className='relative max-w-sm w-full bg-[#1b1b1b] rounded-2xl p-6 shadow-2xl border border-white/10'>
        <h3 className='text-2xl font-bold mb-3 text-center'>{title}</h3>
        <p className='text-white/70 text-center mb-3'>{desc}</p>
        <div className='flex justify-center mb-4'>
          <Image src='/lock.png' alt='lock' width={48} height={160} />
        </div>
        <button
          onClick={onAction}
          className='w-full py-3 rounded-full bg-white text-black font-medium'
          aria-label={cta}
        >
          {cta}
        </button>
      </div>
    </div>
  );
}
