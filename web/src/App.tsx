import {Route, Routes} from 'react-router-dom'
import NavBar from './components/NavBar'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Services from './pages/Services'
import './App.css'

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>
    </>
  )
}

export default App
