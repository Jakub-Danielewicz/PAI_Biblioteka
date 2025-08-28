const CalendarWidget = () => {
  const today = new Date();
  const month = today.toLocaleString("en-US", { month: "long" });
  const year = today.getFullYear();
  const currentDay = today.getDate();

  const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-fit">
      <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">
        {month} {year}
      </h2>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="font-semibold text-gray-500">
            {d}
          </div>
        ))}
        {days.map((day) => (
          <div
            key={day}
            className={`flex items-center justify-center w-8 h-8 rounded-full 
              ${day === currentDay ? "bg-blue-500 text-white font-bold" : "text-gray-700"}`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWidget;
