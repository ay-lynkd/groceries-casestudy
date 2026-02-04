import { Confetti } from '@/components/common';
import React, { createContext, useContext, useState } from 'react';

interface ConfettiContextType {
  showConfetti: () => void;
}

const ConfettiContext = createContext<ConfettiContextType | undefined>(undefined);

export const useConfetti = () => {
  const context = useContext(ConfettiContext);
  if (!context) {
    throw new Error('useConfetti must be used within a ConfettiProvider');
  }
  return context;
};

interface ConfettiProviderProps {
  children: React.ReactNode;
}

export const ConfettiProvider: React.FC<ConfettiProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showConfetti = () => {
    setIsVisible(true);
  };

  const handleAnimationComplete = () => {
    setIsVisible(false);
  };

  return (
    <ConfettiContext.Provider value={{ showConfetti }}>
      {children}
      {isVisible && <Confetti onAnimationComplete={handleAnimationComplete} />}
    </ConfettiContext.Provider>
  );
};