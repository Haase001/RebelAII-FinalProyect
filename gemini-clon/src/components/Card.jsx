
const FeatureCard = ({title, description, icon}) => {
    return(
        <div className="flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300">
            <div className="text-4xl text-blue-500 dark:text-blue-400 mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">{description}</p>
        </div>
    )
};

export default FeatureCard