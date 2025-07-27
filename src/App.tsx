// App.tsx
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './layouts/Header';
import Navigation from './layouts/Navigation';

function App() {
  const location = useLocation();

  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Check if current route should hide the navigation
  const hideNavOnRoutes = ['/login', '/signup', '/onboarding'];
  const showNavigation = !hideNavOnRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background-primary text-text-primary flex flex-col">
      <Header />
      
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>

      {showNavigation && <Navigation />}
      
      {/* Global notification container */}
      <div id="notifications" className="fixed bottom-20 left-0 right-0 z-50 md:bottom-6 md:left-auto md:right-6 md:max-w-sm" />
    </div>
  );
}

export default App;