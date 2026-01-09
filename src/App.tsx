import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header, Navigation, Footer } from './components/Layout';
import { Home, WorkoutsPage, MealPlansPage, ProgressPage, SettingsPage, Callback } from './pages';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
          <Header />

        <main className="flex-1 container-custom py-6 md:py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/meals" element={<MealPlansPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/callback" element={<Callback />} />
          </Routes>
        </main>

        <Footer />
        <Navigation />
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
