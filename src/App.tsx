import './App.css';
import React from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { ResizableGraphInterface } from './components/ResizableGraphInterface';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main>
        <div className="flex items-center justify-between p-4">
          <img
            src={`/grapher_logo_full_${localStorage.getItem("vite-ui-theme") ?? "dark"}.png`}
            alt="Grapher Logo"
            className="h-24"
            style={{ marginTop: '-1.5rem', marginBottom: '-1rem' }}
          />
          <ModeToggle />
        </div>
        <ResizableGraphInterface />
      </main>
    </ThemeProvider>
  );
};

export default App;
