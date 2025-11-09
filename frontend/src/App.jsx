import './App.css'
import Login from './public-pages/Auth/Login'
import LandingPage from "./public-pages/Landing/Landingpage"
import StudentContainer from './modules/Student/pages/Dashboard/StudentContainer.jsx'
import FAQs from './modules/Student/pages/FAQs/FAQs.jsx'
import AppRoutes from './routes/AppRoutes'
// import Dashboard from './modules/Student/pages/Dashboard/Dashboard.jsx'


function App() {
  return (
    <div>
      <AppRoutes />
    </div>
  )
}

export default App
