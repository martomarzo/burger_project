"use client";

import React from 'react';
import BurgerIcon from './BurgerIcon';

const AppHeader: React.FC = () => {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-3">
        <BurgerIcon className="h-8 w-8 text-secondary" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Burger Builder
        </h1>
      </div>
    </header>
  );
};

export default AppHeader;
