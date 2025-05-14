
"use client";

import React from 'react';
import { Sandwich } from 'lucide-react'; // Changed from UtensilsCrossed to Sandwich

const AppHeader: React.FC = () => {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-3">
        <Sandwich size={32} className="text-secondary" /> {/* Changed icon here */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Burger Builder
        </h1>
      </div>
    </header>
  );
};

export default AppHeader;
