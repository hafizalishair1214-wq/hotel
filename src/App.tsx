import React from 'react';
import { LoyaltyProvider } from './context/LoyaltyContext';
import { Navbar } from './components/layout/Navbar';
import { LoyaltyDashboard } from './components/loyalty/LoyaltyDashboard';
import { Toast } from './components/layout/Toast';
import { Footer } from './components/layout/Footer';

export default function App() {
  return (
    <LoyaltyProvider>
      <div className="min-h-screen bg-[#08090b] text-[#f7f4ee] flex flex-col selection:bg-amber-500 selection:text-stone-950">
        <Navbar />
        <main className="flex-1">
          <LoyaltyDashboard />
        </main>
        <Footer />
        <Toast />
      </div>
    </LoyaltyProvider>
  );
}
