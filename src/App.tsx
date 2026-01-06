import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header, Navigation, Footer } from './components/Layout';
import { Home, WorkoutsPage, MealPlansPage, ProgressPage } from './pages';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-1 container-custom py-6 md:py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/meals" element={<MealPlansPage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        </main>

        <Footer />
        <Navigation />
      </div>
    </Router>
  );
}

export default App;
