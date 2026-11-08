export function UnreadMessageBadge({ count }: { count: number }) {
  if (count < 1) return null;

  return (
    <span
      aria-label={`${count} unread ${count === 1 ? 'message' : 'messages'}`}
      className='inline-flex min-w-5 items-center justify-center rounded-full bg-brand-primary px-1.5 py-0.5 text-[0.7rem] font-semibold text-white'
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
