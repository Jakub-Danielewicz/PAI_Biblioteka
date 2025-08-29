import { useState, useEffect } from "react";
import { BookOpenIcon, ClockIcon, CheckCircleIcon, ExclamationCircleIcon, StarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import api from "../utils/api";
import CalendarWidget from "../components/CalendarWidget";

const today = new Date();

const sectionIcons = {
  Ongoing: ClockIcon,
  Overdue: ExclamationCircleIcon,
  Returned: CheckCircleIcon,
};

export default function BookRentalsPage() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "ongoing" | "overdue" | "returned">("all");
  const [returning, setReturning] = useState<number | null>(null);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await api.get("/borrows");
        setRentals(response.data || []);
        setLoading(false);
      } catch (e: any) {
        console.error(e);
        setError(e.response?.data?.message || "Failed to fetch rentals");
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const handleReturn = async (borrowId: number) => {
    setReturning(borrowId);
    try {
      await api.post('/return', { borrowId });
      // Refresh the rentals list
      const response = await api.get("/borrows");
      setRentals(response.data || []);
    } catch (error: any) {
      console.error('Failed to return book:', error);
      alert(error.response?.data?.error || 'Failed to return book');
    } finally {
      setReturning(null);
    }
  };

  const filteredRentals = rentals
    .filter((rental) => {
      const borrowDate = new Date(rental.borrowedAt);
      const dueDate = new Date(borrowDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from borrow date
      const isReturned = rental.returnedAt !== null;
      
      if (filter === "ongoing") return !isReturned && dueDate >= today;
      if (filter === "overdue") return !isReturned && dueDate < today;
      if (filter === "returned") return isReturned;
      return true;
    })
    .sort((a, b) => {
      const dueDateA = new Date(new Date(a.borrowedAt).getTime() + 30 * 24 * 60 * 60 * 1000);
      const dueDateB = new Date(new Date(b.borrowedAt).getTime() + 30 * 24 * 60 * 60 * 1000);
      return dueDateA.getTime() - dueDateB.getTime();
    });

  const sections = {
    Ongoing: filteredRentals.filter(b => {
      const isReturned = b.returnedAt !== null;
      const dueDate = new Date(new Date(b.borrowedAt).getTime() + 30 * 24 * 60 * 60 * 1000);
      return !isReturned && dueDate >= today;
    }),
    Returned: filteredRentals.filter(b => b.returnedAt !== null),
    Overdue: filteredRentals.filter(b => {
      const isReturned = b.returnedAt !== null;
      const dueDate = new Date(new Date(b.borrowedAt).getTime() + 30 * 24 * 60 * 60 * 1000);
      return !isReturned && dueDate < today;
    }),
  };

  const sectionOrder: (keyof typeof sections)[] = ["Ongoing", "Returned", "Overdue"];

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-800 text-lg">Loading rentals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">📚 My Rentals</h1>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 p-6 flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-1/4 bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📅 Calendar</h2>
          <CalendarWidget />
        </aside>

        <section className="flex-1 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">📚 My Rentals</h1>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 sm:py-3 rounded-xl border border-gray-300 bg-gradient-to-r from-blue-50 to-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg font-medium transition-all hover:scale-105"
            >
              <option value="all">All</option>
              <option value="ongoing">Ongoing</option>
              <option value="overdue">Overdue</option>
              <option value="returned">Returned</option>
            </select>
          </div>

          {sectionOrder.map((sectionName) => {
            const books = sections[sectionName];
            if (!books.length) return null;
            const SectionIcon = sectionIcons[sectionName as keyof typeof sectionIcons] || BookOpenIcon;

            return (
              <div key={sectionName} className="flex flex-col gap-6 pt-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 border-b border-gray-300 pb-2 flex items-center gap-2">
                  <SectionIcon
                    className={`w-6 h-6 ${
                      sectionName === "Overdue"
                        ? "text-red-500"
                        : sectionName === "Ongoing"
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  />
                  {sectionName}
                </h2>

                <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
                  {books.map((rental) => {
                    const borrowDate = new Date(rental.borrowedAt);
                    const dueDate = new Date(borrowDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                    const isReturned = rental.returnedAt !== null;

                    let statusColor = "border-gray-400";
                    let textColor = "text-gray-600";
                    let statusText = "";

                    if (isReturned) {
                      statusText = "Returned";
                      statusColor = "border-gray-400";
                      textColor = "text-gray-500";
                    } else if (dueDate < today) {
                      statusText = "Overdue!";
                      statusColor = "border-red-500";
                      textColor = "text-red-600";
                    } else {
                      statusText = "Ongoing";
                      statusColor = "border-green-500";
                      textColor = "text-green-600";
                    }

                    return (
                      <motion.div
                        key={rental.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className={`bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-5 border-l-8 ${statusColor} transition transform hover:scale-105 hover:shadow-2xl flex flex-col gap-3`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-4">
                            <BookOpenIcon className="w-10 h-10 text-blue-500 flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{rental.copy.book.title}</h3>
                              <p className="text-gray-500 text-sm">Author: {rental.copy.book.author}</p>
                              <p className="text-gray-500 text-sm">Borrowed: {borrowDate.toDateString()}</p>
                              <p className="text-gray-500 text-sm">Due: {dueDate.toDateString()}</p>
                            </div>
                          </div>
                          
                          {!isReturned && (
                            <button
                              onClick={() => handleReturn(rental.id)}
                              disabled={returning === rental.id}
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {returning === rental.id ? 'Returning...' : 'Return Book'}
                            </button>
                          )}
                        </div>

                        <p className={`font-medium ${textColor}`}>{statusText}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
