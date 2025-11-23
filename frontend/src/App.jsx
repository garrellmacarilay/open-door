import './App.css';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext'; // make sure the path is correct

function App() {
  return (
    <AuthProvider>
      <div>
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
