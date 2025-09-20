import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../context/Context.jsx";
import AnimatedLayout from '../components/AnimatedLayout.jsx';
import Chats from "../pages/Chats.jsx";
import Home from "../pages/Home.jsx";
import Settings from "../pages/Settings.jsx";
import AuthForm from "../auth/AuthForm.jsx";
import AuthForm2 from "../auth/AuthForm2.jsx";




const AppRoutes = () => {

        const {user} = useContext(Context)

    return(
        <Routes>
            <Route element={<AnimatedLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/1" element={<AuthForm />} />
                <Route path="/auth" element={<AuthForm2 />} />
                <Route path="/chats" element={
                    user ? <Chats /> : <Navigate to="/auth" />
                } />
                <Route path="/settings" element={
                    user ? <Settings /> : <Navigate to="/auth" />
                } />
                <Route path='*' element={ <h2 className='text-center' >404</h2> } />
            </Route>
        </Routes>
    )
}

export default AppRoutes;