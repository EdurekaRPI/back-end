import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-8 relative overflow-hidden">

            {/* Decorative Circles */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-white opacity-20 rounded-full blur-3xl"></div>

            {/* Title */}
            <h1 className="text-6xl font-extrabold text-white mb-12 drop-shadow-lg">
                Edureka
            </h1>

            {/* Buttons Container */}
            <div className="flex flex-wrap gap-6 justify-center">
                {/* About Page Button */}
                <Link href="/about" className="flex items-center justify-center bg-white bg-opacity-80 text-gray-800 rounded-lg shadow-lg p-6 w-40 h-40 hover:bg-opacity-100 transition transform hover:scale-105">
                    <div className="text-3xl font-bold text-center">
                        Go to<br/>About
                    </div>
                </Link>

                {/* List Page Button */}
                <Link href="/list" className="flex items-center justify-center bg-white bg-opacity-80 text-gray-800 rounded-lg shadow-lg p-6 w-40 h-40 hover:bg-opacity-100 transition transform hover:scale-105">
                    <div className="text-3xl font-bold text-center">
                        Go to<br/>List
                    </div>
                </Link>

                {/* Decision Page Button */}
                <Link href="/decision" className="flex items-center justify-center bg-white bg-opacity-80 text-gray-800 rounded-lg shadow-lg p-6 w-40 h-40 hover:bg-opacity-100 transition transform hover:scale-105">
                    <div className="text-3xl font-bold text-center">
                        Go to<br/>Decision
                    </div>
                </Link>
            </div>

            {/* Footer Decoration */}
            <div className="absolute bottom-4 text-white text-sm">
                © 2024 Edureka. All rights reserved.
            </div>
        </div>
    );
}
