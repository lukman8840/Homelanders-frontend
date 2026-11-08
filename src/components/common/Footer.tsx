import { BrandMark } from './BrandMark';

export function Footer() {
  return (
    <footer className='border-t border-border bg-white' id='about'>
      <div className='mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10'>
        <BrandMark />
        <p className='text-sm text-text-muted'>
          © {new Date().getFullYear()} HomeLander. Property discovery, made more human.
        </p>
      </div>
    </footer>
  );
}
