import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Messages from './pages/Messages'
import Home from './pages/Home'
import NoPage from './pages/404'
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import './App.css'
import TopNav from "./components/Topnav.jsx";

function Layout() {
  return <>
    <Outlet />
  </>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}/>
          <Route path="login" element={<Login />}/>
          <Route path="signup" element={<Signup />}/>
          <Route path="messages" element={<Messages />}/>
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
