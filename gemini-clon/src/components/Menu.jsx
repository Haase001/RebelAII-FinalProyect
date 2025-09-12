
const Menu = ({index}) => {

    const data = ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'];

    return(
        <div 
        className="absolute left-60 right-0 top-0 mt-1 bg-stone-300 rounded-md shadow-lg z-50 option-menu"
        id={index+"menu"}
        >
            <div className="py-1">
                {data.map((option, index) => (
                    <div key={index+"option"} className="px-4 py-2 hover:bg-gray-600 cursor-pointer">
                        {option}
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Menu