"use client";

import React from 'react';
import BurgerIcon from './BurgerIcon';
import ThemeToggle from './ThemeToggle';

const AppHeader: React.FC = () => {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <BurgerIcon className="h-8 w-8 shrink-0 text-secondary" />
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight truncate">
            Burger Builder
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default AppHeader;
