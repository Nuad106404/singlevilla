import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { VillaHero } from './components/villa/VillaHero';
import { VillaDetails } from './components/villa/VillaDetails';
import { BookingCard } from './components/booking/BookingCard';
import { BookingPage } from './pages/BookingPage';
import { ThemeProvider } from './context/ThemeContext';

function HomePage() {
  return (
    <main className="relative">
      <VillaHero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <VillaDetails />
          </div>
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <BookingCard />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/booking" element={<BookingPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;