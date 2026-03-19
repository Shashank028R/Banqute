import React, { createContext, useContext, useState, useEffect } from 'react';

interface FontSizeContextType {
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export const FontSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app-font-size-v2');
      return saved ? parseInt(saved, 10) : 12; // Default 12px
    }
    return 12;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-font-size-v2', fontSize.toString());
      
      // We use a responsive formula: base size + a small percentage of viewport width
      // This ensures it scales with screen ratio but stays within a limit
      const minSize = Math.max(8, fontSize - 2);
      const maxSize = Math.min(24, fontSize + 10);
      
      // 0.2vw adds about 3.8px on 1920px screen
      document.documentElement.style.fontSize = `clamp(${minSize}px, calc(${fontSize}px + 0.2vw), ${maxSize}px)`;
    }
  }, [fontSize]);

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 1, 20)); // Max 20px
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 1, 8)); // Min 8px
  const resetFontSize = () => setFontSize(12);

  return (
    <FontSizeContext.Provider value={{ fontSize, increaseFontSize, decreaseFontSize, resetFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};
