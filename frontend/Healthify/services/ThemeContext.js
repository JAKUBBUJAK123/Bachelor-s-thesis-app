import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const lightTheme = {
    background: '#ffffff',
    cardBackground: '#f5f5f5',
    text: '#000000',
    secondaryText: '#555555',
    progressBar: '#4caf50',
    chartGradientFrom: '#e0f7fa', 
    chartGradientTo: '#ffffff',
    chartLineColor: '#4caf50',
    chartBarColor: '#81c784',
  };

  const darkTheme = {
    background: '#262322',
    cardBackground: '#3A3736',
    text: '#ffffff',
    secondaryText: '#a8a7a3',
    progressBar: '#4caf50',
    chartGradientFrom: '#57534f', 
    chartGradientTo: '#3d3b38', 
    chartLineColor: '#81d4fa', 
    chartBarColor: '#4fc3f7'
  };

  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const theme = isDarkTheme ? darkTheme : lightTheme;

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);