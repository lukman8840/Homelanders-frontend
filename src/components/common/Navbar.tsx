import { useState } from 'react';
import { ArrowRight, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandMark } from './BrandMark';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className='border-b border-border bg-white'>
      <div className='mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10'>
        <Link aria-label='HomeLander home' className='shrink-0' to='/'>
          <BrandMark />
        </Link>

        <nav
          aria-label='Main navigation'
          className='hidden items-center gap-7 md:flex'
          id='main-navigation-desktop'
        >
          <Link
            className='text-sm font-medium text-text-muted hover:text-brand-primary'
            to='/properties'
          >
            Browse homes
          </Link>
          <a
            className='text-sm font-medium text-text-muted hover:text-brand-primary'
            href='/#how-it-works'
          >
            How it works
          </a>
        </nav>

        <div className='flex items-center gap-3'>
          <Link
            className='hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-soft sm:inline-flex'
            to='/login'
          >
            Sign in <ArrowRight aria-hidden='true' size={15} />
          </Link>
          <button
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls='main-navigation-mobile'
            className='inline-flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 md:hidden'
            onClick={() => setIsMenuOpen((open) => !open)}
            type='button'
          >
            <Menu aria-hidden='true' size={19} />
          </button>
        </div>
      </div>
      <nav
        aria-label='Main navigation'
        className={`${isMenuOpen ? 'flex' : 'hidden'} flex-col gap-1 border-t border-border px-5 py-3 md:hidden`}
        id='main-navigation-mobile'
      >
        <Link
          className='rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:bg-brand-soft hover:text-brand-primary'
          onClick={() => setIsMenuOpen(false)}
          to='/properties'
        >
          Browse homes
        </Link>
        <a
          className='rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:bg-brand-soft hover:text-brand-primary'
          href='/#how-it-works'
          onClick={() => setIsMenuOpen(false)}
        >
          How it works
        </a>
        <Link
          className='rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:bg-brand-soft hover:text-brand-primary'
          onClick={() => setIsMenuOpen(false)}
          to='/login'
        >
          Sign in
        </Link>
      </nav>
    </header>
  );
}
