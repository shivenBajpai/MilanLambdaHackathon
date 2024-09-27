import Login from "./pages/Login"
import Signup from "./pages/Signup"
import MessageWrapper from './pages/Messages'
import Home from './pages/Home'
import NoPage from './pages/404'
import { BrowserRouter, Routes, Route, Outlet, Await } from "react-router-dom";
import './App.css'
import TopNav from "./components/Topnav.jsx";
import { Suspense } from "react"

function Layout() {
  return <div>
    <Outlet />
  </div>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}/>
          <Route path="login" element={<Login />}/>
          <Route path="signup" element={<Signup />}/>

          <Route path="messages" element={
            <Suspense fallback={<div>Loading...</div>}>
                <Await
                    resolve={MessageWrapper().catch((err) => console.log(err))}
                    errorElement={<div>Could not load user details ?</div>}
                    children={(element) => {return <div>{element}</div>;}}
                />
            </Suspense>
          }/>
          
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
