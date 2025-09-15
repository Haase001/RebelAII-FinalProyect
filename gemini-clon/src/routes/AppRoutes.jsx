import { Routes, Route } from "react-router-dom";
import Chats from "../pages/Chats.jsx";
import Home from "../pages/Home.jsx";
import Settings from "../pages/Settings.jsx";
import AnimatedLayout from '../components/AnimatedLayout.jsx';


const AppRoutes = () => {
    return(
        <Routes>
            <Route element={<AnimatedLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/chats" element={<Chats />} />
                <Route path="/settings" element={<Settings />} />
                <Route path='*' element={ <h2 className='text-center' >404</h2> } />
            </Route>
        </Routes>
    )
}

export default AppRoutes;