import { useState } from "react";
import { BookOpenIcon, ClockIcon, CheckCircleIcon, ExclamationCircleIcon, StarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import CalendarWidget from "../components/CalendarWidget";

const rentals = [
  { id: "1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", deadline: "2025-08-20", returned: false, rating: 5 },
  { id: "2", title: "1984", author: "George Orwell", deadline: "2025-08-18", returned: true, rating: 4 },
  { id: "3", title: "Moby Dick", author: "Herman Melville", deadline: "2025-08-25", returned: false, rating: 3 },
  { id: "4", title: "To Kill the Mockingbird", author: "Harper Lee", deadline: "2025-08-26", returned: false, rating: 5 },
  { id: "8", title: "The Catcher in the Rye", author: "J.D. Salinger", deadline: "2025-08-22", returned: true, rating: 4 },
  { id: "9", title: "The Hobbit", author: "J.R.R. Tolkien", deadline: "2025-08-01", returned: true, rating: 5 },
  { id: "10", title: "The Road", author: "Cormac McCarthy", deadline: "2025-08-27", returned: false, rating: 4 },
  { id: "11", title: "Brave New World", author: "Aldous Huxley", deadline: "2025-08-11", returned: false, rating: 4 },
  { id: "12", title: "Anna Karenina", author: "Leo Tolstoy", deadline: "2025-09-01", returned: false, rating: 5 },
];

const today = new Date();

const sectionIcons = {
  Ongoing: ClockIcon,
  Overdue: ExclamationCircleIcon,
  Returned: CheckCircleIcon,
};

export default function BookRentalsPage() {
  const [filter, setFilter] = useState<"all" | "ongoing" | "overdue" | "returned">("all");

  const filteredRentals = rentals
    .filter((book) => {
      const deadlineDate = new Date(book.deadline);
      if (filter === "ongoing") return !book.returned && deadlineDate >= today;
      if (filter === "overdue") return !book.returned && deadlineDate < today;
      if (filter === "returned") return book.returned;
      return true;
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const sections = {
    Ongoing: filteredRentals.filter(b => !b.returned && new Date(b.deadline) >= today),
    Returned: filteredRentals.filter(b => b.returned),
    Overdue: filteredRentals.filter(b => !b.returned && new Date(b.deadline) < today),
  };

  const sectionOrder: (keyof typeof sections)[] = ["Ongoing", "Returned", "Overdue"];

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
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
                  {books.map((book) => {
                    const deadlineDate = new Date(book.deadline);

                    let statusColor = "border-gray-400";
                    let textColor = "text-gray-600";
                    let statusText = "";

                    if (book.returned) {
                      statusText = "Returned";
                      statusColor = "border-gray-400";
                      textColor = "text-gray-500";
                    } else if (deadlineDate < today) {
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
                        key={book.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className={`bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-5 border-l-8 ${statusColor} transition transform hover:scale-105 hover:shadow-2xl flex flex-col gap-3`}
                      >
                        <div className="flex items-center gap-4">
                          <BookOpenIcon className="w-10 h-10 text-blue-500 flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{book.title}</h3>
                            <p className="text-gray-500 text-sm">Author: {book.author}</p>
                            <p className="text-gray-500 text-sm">Deadline: {deadlineDate.toDateString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-5 h-5 ${i < book.rating ? "text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
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
