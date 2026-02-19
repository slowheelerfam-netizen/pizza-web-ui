
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { createOrderAction, checkCustomerWarningAction } from './actions';

export default async function HomePage() {
  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070')",
      }}
    >
      <main className="flex-grow max-w-[1400px] mx-auto relative w-full">
        <Header />
        <Hero createOrderAction={createOrderAction} checkCustomerWarningAction={checkCustomerWarningAction} />
      </main>
      <Footer />
    </div>
  );
}
