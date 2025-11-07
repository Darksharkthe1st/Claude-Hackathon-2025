import Navbar from './components/Navbar.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

const App = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <AppRoutes />
      </main>
    </div>
  );
};

export default App;

