export default function Progress({ value }: { value: number }) {
  return (
    <div className='w-full h-2 rounded-full bg-white/10 overflow-hidden mb-6'>
      <div
        className='h-full bg-white rounded-full transition-all duration-500 ease-in-out shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
