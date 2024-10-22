"use client";

import { useState } from "react";
import Link from "next/link";

export default function ListPage() {
    // Initialize the list of items
    const [items, setItems] = useState([
        { id: 1, name: "Item One", status: "Pending" },
        { id: 2, name: "Item Two", status: "Pending" },
        { id: 3, name: "Item Three", status: "Pending" },
        { id: 4, name: "Item Four", status: "Pending" },
    ]);

    // Handler to update the status of an item
    const handleStatusChange = (id, newStatus) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, status: newStatus } : item
            )
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
            {/* Header */}
            <h1 className="text-4xl font-bold text-gray-800 mb-8">列表页面</h1>

            {/* List Container */}
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
                <ul>
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="flex justify-between items-center py-4 border-b last:border-b-0"
                        >
                            <div>
                <span className="text-xl font-medium text-gray-700">
                  {item.name}
                </span>
                                <span
                                    className={`ml-4 px-2 py-1 text-sm rounded ${
                                        item.status === "Approved"
                                            ? "bg-green-200 text-green-800"
                                            : item.status === "Rejected"
                                                ? "bg-red-200 text-red-800"
                                                : "bg-yellow-200 text-yellow-800"
                                    }`}
                                >
                  {item.status}
                </span>
                            </div>
                            <div className="flex space-x-2">
                                {item.status === "Pending" && (
                                    <>
                                        <button
                                            onClick={() => handleStatusChange(item.id, "Approved")}
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(item.id, "Rejected")}
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                                {(item.status === "Approved" || item.status === "Rejected") && (
                                    <span className="text-sm text-gray-500">No actions available</span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Back to Home Button */}
            <Link href="/" className="mt-8 text-blue-500 hover:underline">
                &larr; back to main
            </Link>
        </div>
    );
}
