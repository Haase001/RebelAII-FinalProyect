import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Context } from "../context/Context.jsx"
import { checkEmailExists, registerUser, loginUser } from "../services/api";


const AuthForm = () => {

    //Estados necesarios en el componente
    const [step, setStep] = useState('initial'); // 'initial', 'signup', 'login'
    const [showPass, setShowPass] = useState(false); // Define si se mostrará la contraseña
    const [authError, setAuthError] = useState('');

    //Validaciones con useForm
    const userFormSchema = yup.object({
        email: yup.string().email("Correo electrónico inválido").required("Es necesario escribir un correo"),

    password: step === 'login'
        ? yup
            .string()
            .required()
        : yup
            .string()
            .min(8, "La contraseña debe tener un mínimo de 8 caracteres")
            .matches(/[A-Za-z]/, "La contraseña debe incluir letras")
            .matches(/\d/, "Debe incluir números")
            .required("Es necesario escribir una contraseña"),

    confirmPassword: step === 'signup'
        ? yup
            .string()
            .oneOf([yup.ref('password')], "Las contraseñas no coinciden")
            .required("Confirma tu contraseña")
        : yup.string().notRequired(),

    firstName: step === 'signup'
        ? yup.string().required("Escribe tu nombre")
        : yup.string().notRequired(),

    lastName: step === 'signup'
        ? yup.string().required("Escribe tus apellidos")
        : yup.string().notRequired(),

    birthDate: step === 'signup'
        ? yup
            .date()
            .max(new Date(), "La fecha no puede ser futura")
            .required("Escribe tu fecha de nacimiento")
        : yup.date().notRequired(),
    }).required();


    //Usamos useForm con el esquema de validación de yup
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        trigger,
    } = useForm({
        resolver: yupResolver(userFormSchema),
        mode: "onchange",
        })

    
    // Obtener el valor actual del email
    const emailValue = useWatch({ control, name: 'email' });

    //Navegación
    const navigate = useNavigate();

    //Contexto
    const { setIsSidebarHidden, user, setUser } = useContext(Context);
    
    useEffect(()=>{
        if (user) {
            navigate("/chats")
        }
    },[navigate, user])

    useEffect(()=>{
        setIsSidebarHidden(true)
    },[setIsSidebarHidden]);

    //Funciones para mostrár el título y subtítulo del formulario
    const title = () => {
        if (step === 'initial') {
            return 'Inicia sesión o suscríbete';
        } else if (step === 'signup') {
            return 'Crea tu cuenta';
        } else if (step === 'login') {
            return 'Ingresa tu contraseña';
        }
    };

    const subtitle = () => {
        if (step === 'initial') {
            return 'Obtendrás respuestas más inteligentes, podrás cargar archivos e imágenes, y más.';
        } else if (step === 'signup') {
            return 'Establece tu contraseña para continuar';
        }
        return null;
    };

    //Funciones para manejar eventos
    //Continue
    const handleContinue = async ()=> {
        const isValid = await trigger('email')

        if (!isValid) return;

        try {
            const result = await checkEmailExists(emailValue);

            if (result.exists) {
                setStep('login');
            } else {
                setStep('signup');
            }
        } catch (error) {
            console.error('Error al verificar correo:', error);
        }
    }

    //Back
    const handleBack = () => {
        setStep("initial");
        reset();
    }

    //submit
    const onSubmit = async (data) => {
        //En dado caso que el estado sea initial finalizamos la función
        if (step === 'initial') {
            return
        }

        //Verificamos si el estado es signup
        if (step === 'signup') {
            try {
                const result = await registerUser({
                    email: data.email,
                    password: data.password,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    birthDate: data.birthDate,
                });
                if (result.error) {
                    console.error('Error al registrar:', result.error);
                    return;
                }
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user)); 
                setUser(result.user); // actualiza el contexto
                console.log('Usuario registrado:', result);
                setStep('initial');
                reset();
                navigate("/chats");

            } catch (error) {
                console.error('Error inesperado en registro:', error)
            }
        }
        if (step === 'login') {
            try {
                const result = await loginUser({
                    email: data.email,
                    password: data.password,
                });

                if (result.token) {
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('user', JSON.stringify(result.user)); 
                    setUser(result.user); // actualiza el contexto
                    console.log('Login exitoso');
                    setStep('initial');
                    setAuthError('')
                    reset();
                    navigate("/chats");
                } else {
                    console.error('Error al iniciar sesión:', result.error);
                    setAuthError(result.error || 'Error desconocido al iniciar sesión');
                }

            } catch (error) {
                console.error('Error inesperado en login:', error);
            }
    }

    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (step === 'initial') {
                handleContinue()
            } else{
                handleSubmit(onSubmit)();
            }
        }
    } 


    return(
        <div 
        id="authform"
        className="flex items-center justify-center bg-gray-100 dark:bg-gray-900"
        >
            <div className="w-full max-w-sm p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {title()}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {subtitle()}
                    </p>
                </div>

                {/*Formulario de validación*/}
                <form 
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                >
                    <div className="relative">
                        {/*Input de correo -- Siempre visible en el formulario*/}
                        <input 
                        id="email"
                        type="email"
                        {...register('email')}
                        disabled={step !== 'initial'}
                        className={`peer w-full p-3 rounded-xl border transition-colors duration-300  dark:bg-gray-800 text-gray-900 dark:text-white outline-none ${errors.email ? 'border-red-500' : `border-gray-300 dark:border-gray-600 focus:border-blue-500`} ${step !== 'initial' ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                        placeholder="Dirección de correo electrónico"
                        
                        onKeyDown={handleKeyPress}
                        />
                        {/*Etiqueta flotante, solo visible en el primer paso ("initial") */}
                        <label 
                        htmlFor="email"
                        className={`absolute  dark:text-gray-500 transition-all duration-300 ${emailValue ? "-top-2 left-3 text-xs text-blue-500" : "top-3 left-3 text-gray-400 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:text-blue-500"}  bg-white dark:bg-gray-800 px-1 pointer-events-none`}>
                            Dirección de correo electrónico
                        </label>

                        {/*Botón para editar -- Visible a partir del segundo paso*/}
                        {step !== "initial" && (
                            <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500 hover:underline"
                            onClick={handleBack}
                            >
                                Editar
                            </button>
                        )}
                    </div>
                    {/*Error solo se mostrará al ocurrir un error*/}
                    {errors.email && ( <p className="text-red-500 text-sm mt-1">{errors.email.message}</p> )}

                    {/*Boton Continuar (initial) */}
                    {step === 'initial' && (
                        <button
                        type="button"
                        onClick={handleContinue}
                        className="w-full py-3 px-4 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 rounded-full font-semibold hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
                        >
                            Continuar
                        </button>
                    )}

                    {/*Input de contraseña en el paso login */}
                    {step === "login" && (
                        <>
                            <div className="relative">
                                <input
                                id="password"
                                type={showPass ? 'text' : 'password'}
                                placeholder="Contraseña"
                                {...register('password')}
                                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                                />
                                <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {/* Icono simple para mostrar/ocultar */}
                                    {showPass ? 'Ocultar' : 'Mostrar'}
                                </button>
                            </div>
                            {/*Error solo se mostrará al ocurrir un error*/}
                            {errors.password && ( <p className="text-red-500 text-sm mt-1">{errors.password.message}</p> )}
                            {authError && <p className="text-red-500 text-sm mt-1">{authError}</p>}
                        </>
                    )}
                    
                    {/*Formulario en el paso signup */}
                    {step === "signup" && (
                        <>
                            {/* Nombre y apellidos */}
                            <div>
                                <input
                                id="firstName"
                                type="text"
                                placeholder="Nombre"
                                {...register('firstName')}
                                className="w-5/12 p-3 mr-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                                />
                                {errors.firstName && ( <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p> )}
                                <input
                                id="lastName"
                                type="text"
                                placeholder="Apellidos"
                                {...register('lastName')}
                                className="w-5/12 p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                                />
                                {errors.lastName && ( <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p> )}
                            </div>

                            {/* Fecha de nacimiento */}
                            <div className="relative">
                                <input
                                id="birthDate"
                                type="date"
                                {...register('birthDate')}
                                className=" w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500 appearance-none"
                                />
                                <i className="fa-regular fa-calendar absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                {errors.birthDate && ( <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p> )}
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <input
                                id="password"
                                type={showPass ? 'text' : 'password'}
                                placeholder="Contraseña"
                                {...register('password')}
                                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                                />
                                <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {/* Icono simple para mostrar/ocultar */}
                                    {showPass ? 'Ocultar' : 'Mostrar'}
                                </button>
                            </div>
                            {/*Error solo se mostrará al ocurrir un error*/}
                            {errors.password && ( <p className="text-red-500 text-sm mt-1">{errors.password.message}</p> )}

                            {/* Confirmación de contraseña */}
                            <div>
                                <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirmar contraseña"
                                {...register('confirmPassword')}
                                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                                />
                                {errors.confirmPassword && ( <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p> )}
                            </div>
                        </>
                    )}

                    {/*Botón final  */}
                    {step !== "initial" && (
                        <button
                        type="submit"
                        onKeyDown={handleKeyPress}
                        className="w-full py-3 px-4 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 rounded-full font-semibold hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
                        >
                            {step === 'signup' ? 'Crear Cuenta' : 'Ingresar'}
                        </button>
                    )}
                </form>
            </div>
        </div>
    )
};

export default AuthForm;