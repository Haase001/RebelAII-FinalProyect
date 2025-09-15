// src/pages/Home.jsx
import { useContext, useEffect } from 'react';
import { Context } from '../context/Context.jsx';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/Card.jsx';

const Home = () => {

    const { setIsSidebarHidden } = useContext(Context);

    useEffect(()=>{
        setIsSidebarHidden(true)
    },[setIsSidebarHidden])


    return (
        <>
            <div className="relative min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased transition-colors duration-300 flex flex-col">
                {/* Fondo decorativo */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 via-transparent to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 opacity-20" />
                    <div className="absolute top-5 left-3 w-60 h-80 bg-blue-400 rounded-full blur-3xl opacity-10 animate-pulse" />
                </div>

                {/* Hero Section */}
                <header className="flex-1 flex justify-center items-center p-8 md:p-12">
                    <div className='h-full w-1/4 self-start'>
                        <i className="fa-brands fa-fulcrum text-[15rem] text-blue-500 mr-3"></i>
                    </div>
                    <div className='flex flex-col items-center justify-center text-center'>
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                            Tu asistente personal, <br /> potenciado por la IA de La Republica Galáctica.
                        </h1>
                        <p className="max-w-xl text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
                            Desde la creatividad hasta la productividad, Gemini te ayuda a hacer más.
                            Obtén respuestas, genera ideas y organiza tu vida con solo una pregunta.
                        </p>
                        <Link to="/chats">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full text-lg transition-colors shadow-md">
                                Empezar a chatear
                            </button>
                        </Link>
                    </div>
                </header>

                {/* Features Section */}
                <section className="bg-gray-50 dark:bg-gray-900 p-8 md:p-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Lo que puedes hacer con Gemini</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <FeatureCard
                        title="Creatividad"
                        description="Genera ideas, escribe poemas y crea imágenes."
                        icon="🎨"
                        />
                        <FeatureCard
                        title="Productividad"
                        description="Resume documentos, redacta correos y planifica eventos."
                        icon="🚀"
                        />
                        <FeatureCard
                        title="Aprendizaje"
                        description="Explora nuevos temas y obtén explicaciones detalladas."
                        icon="🧠"
                        />
                        <FeatureCard
                        title="Conversación"
                        description="Mantén conversaciones fluidas y naturales."
                        icon="💬"
                        />
                        <FeatureCard
                        title="Análisis de Archivos"
                        description="Carga y analiza documentos e imágenes."
                        icon="📂"
                        />
                        <FeatureCard
                        title="Asistencia personal"
                        description="Tu compañero para organizar la vida diaria."
                        icon="✨"
                        />
                    </div>
                </section>

                {/* Footer (simple) */}
                <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-gray-600 dark:text-gray-300">
                            © 2025 RebelAI. Todos los derechos reservados.
                        </p>
                        <div className="flex justify-center space-x-6 mt-4">
                            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">Términos</a>
                            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">Privacidad</a>
                            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">Soporte</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};


export default Home;
