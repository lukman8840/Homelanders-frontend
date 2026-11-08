import { Outlet } from 'react-router-dom';
import { Footer } from '../../components/common/Footer';
import { Navbar } from '../../components/common/Navbar';

export function PublicLayout() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
