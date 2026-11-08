import { ArrowRight, BadgeCheck, CircleCheck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { sampleProperties } from '../features/properties/data/sampleProperties';
import { PropertyGrid } from '../features/properties/components/PropertyGrid';

const steps = [
  {
    number: '01',
    title: 'Explore at your pace',
    description: 'Browse homes across Abuja and start with the districts that feel right to you.',
  },
  {
    number: '02',
    title: 'Get clear details',
    description: 'Understand the basics of a home before deciding whether to learn more.',
  },
  {
    number: '03',
    title: 'Move with confidence',
    description: 'A thoughtful process should make each next step feel a little simpler.',
  },
];

export function HomePage() {
  return (
    <>
      <section className='bg-background'>
        <Container className='grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:py-24'>
          <div className='max-w-2xl'>
            <p className='inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold tracking-wide text-brand-primary'>
              <span aria-hidden='true' className='size-1.5 rounded-full bg-brand-primary' />A more
              considered property marketplace
            </p>
            <h1 className='mt-6 text-5xl font-semibold leading-[1.06] tracking-[-0.045em] text-text-primary sm:text-6xl lg:text-7xl'>
              Find a place
              <br />
              to{' '}
              <span className='font-serif font-medium italic text-brand-primary'>call home.</span>
            </h1>
            <p className='mt-6 max-w-xl text-base leading-7 text-text-muted sm:text-lg sm:leading-8'>
              Discover homes across Abuja with clearer details and a more human way to find the
              right fit.
            </p>
            <form
              action='/properties'
              className='mt-8 grid gap-3 rounded-card border border-border bg-white p-3 shadow-card sm:grid-cols-[1fr_auto] sm:items-end'
              method='get'
              role='search'
            >
              <Input
                autoComplete='off'
                label='Where would you like to live?'
                name='q'
                placeholder='Try Maitama, Jabi, or Gwarinpa'
                type='search'
              />
              <Button className='w-full sm:w-auto' type='submit'>
                Explore homes <ArrowRight aria-hidden='true' size={16} />
              </Button>
            </form>
            <p className='mt-3 text-xs leading-5 text-text-muted'>
              Sample listings are for demonstration only; availability and verification are not
              confirmed.
            </p>
          </div>
          <div className='relative mx-auto w-full max-w-[36rem] lg:ml-auto'>
            <div className='overflow-hidden rounded-card border border-border bg-brand-soft p-2.5 shadow-card sm:p-3'>
              <img
                alt='Illustrative sample image of a bright, modern home interior'
                className='h-[21rem] w-full rounded-[calc(var(--radius-card)-0.25rem)] object-cover sm:h-[29rem]'
                src='https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85'
              />
              <div className='absolute bottom-6 left-6 right-6 rounded-control border border-border bg-white p-4 shadow-card sm:bottom-8 sm:left-8 sm:right-8'>
                <p className='text-xs font-medium text-text-muted'>Abuja, Nigeria</p>
                <p className='mt-1 font-semibold text-text-primary'>
                  A thoughtful start to your search
                </p>
                <p className='mt-1 text-xs text-text-muted'>
                  Illustrative image · not a real listing
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby='featured-heading' className='py-16 sm:py-20'>
        <Container>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='text-sm font-semibold text-brand-primary'>A first look around</p>
              <h2
                className='mt-2 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl'
                id='featured-heading'
              >
                Sample homes in Abuja
              </h2>
              <p className='mt-2 text-sm text-text-muted'>
                Illustrative listings for design review—not available properties.
              </p>
            </div>
            <Link
              className='inline-flex items-center gap-2 self-start text-sm font-semibold text-brand-primary hover:underline sm:self-auto'
              to='/properties'
            >
              Browse all examples <ArrowRight aria-hidden='true' size={16} />
            </Link>
          </div>
          <div className='mt-8'>
            <PropertyGrid properties={sampleProperties.slice(0, 3)} />
          </div>
        </Container>
      </section>

      <section className='border-y border-border bg-white py-16 sm:py-20' id='how-it-works'>
        <Container>
          <div className='max-w-2xl'>
            <p className='text-sm font-semibold text-brand-primary'>A clearer journey</p>
            <h2 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl'>
              Finding home, made more straightforward.
            </h2>
          </div>
          <div className='mt-10 grid gap-4 md:grid-cols-3'>
            {steps.map((step) => (
              <article
                className='rounded-card border border-border bg-background p-6'
                key={step.number}
              >
                <span className='text-sm font-bold text-brand-secondary'>{step.number}</span>
                <h3 className='mt-4 text-lg font-semibold text-text-primary'>{step.title}</h3>
                <p className='mt-2 text-sm leading-6 text-text-muted'>{step.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className='py-16 sm:py-20'>
        <Container>
          <div className='grid gap-8 rounded-card border border-border bg-brand-soft p-6 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:p-12'>
            <div className='grid size-16 place-items-center rounded-card bg-white text-brand-primary shadow-card'>
              <ShieldCheck aria-hidden='true' size={30} />
            </div>
            <div>
              <p className='text-sm font-semibold text-brand-primary'>Trust starts with clarity</p>
              <h2 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary'>
                Verification should be visible—and meaningful.
              </h2>
              <p className='mt-3 max-w-2xl text-sm leading-6 text-text-muted'>
                We want people to understand what has and has not been checked. The verification
                labels on this page are examples only; no property or owner has been verified.
              </p>
              <div className='mt-5 inline-flex items-center gap-2 text-sm font-medium text-text-primary'>
                <CircleCheck aria-hidden='true' className='text-brand-primary' size={18} />
                Clear status, no assumptions
                <BadgeCheck aria-hidden='true' className='text-brand-primary' size={18} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className='pb-16 sm:pb-20'>
        <Container>
          <div className='flex flex-col gap-6 rounded-card bg-brand-primary px-6 py-10 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-12'>
            <div className='max-w-2xl'>
              <p className='text-sm font-medium text-white/75'>Your next chapter starts here</p>
              <h2 className='mt-2 text-3xl font-semibold tracking-tight sm:text-4xl'>
                Ready to explore Abuja?
              </h2>
              <p className='mt-3 text-sm leading-6 text-white/80'>
                Browse illustrative homes and get a feel for the HomeLander experience.
              </p>
            </div>
            <Link
              className='inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-control bg-white px-5 py-2.5 text-sm font-semibold text-brand-primary hover:bg-brand-soft'
              to='/properties'
            >
              Browse sample homes <ArrowRight aria-hidden='true' size={16} />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
