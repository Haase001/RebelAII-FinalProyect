import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray950">
            {/* Sidebar */}
                <Sidebar />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <Navbar />

                {/* Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
