import React, { useEffect, useState, useMemo } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const StaffBookingCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [bookingStats, setBookingStats] = useState({
    today: 0,
    upcoming: 0,
    past: 0,
  });
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchBookings = async (viewType = view, currentDate = date) => {
    try {
      let params = {
        view: viewType,
        date: moment(currentDate).format("YYYY-MM-DD"),
      };
      if (viewType === "month") {
        params.month = moment(currentDate).month() + 1;
        params.year = moment(currentDate).year();
      }

      const response = await axios.get(`${API_BASE_URL}/api/booking/calender`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        params,
      });

      const data = response.data;

      if (data?.data) {
        const formatted = data.data.map((booking) => {
          const bookingDate = moment(booking.date).format("YYYY-MM-DD");
          const bookingTime = booking.time
            ? moment(booking.time, "HH:mm:ss").format("HH:mm:ss")
            : "00:00:00";
          const startDateTime = new Date(`${bookingDate}T${bookingTime}`);
          const endDateTime = new Date(
            startDateTime.getTime() + 60 * 60 * 1000
          );

          // Determine booking status
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const bookingDay = new Date(startDateTime);
          bookingDay.setHours(0, 0, 0, 0);

          let status = "upcoming";
          if (bookingDay.getTime() === today.getTime()) {
            status = "today";
          } else if (bookingDay < today) {
            status = "past";
          }

          return {
            id: booking.id,
            title: `${moment(bookingTime, "HH:mm:ss").format("hh:mm A")} - ${
              booking.customer?.name || "Customer"
            } - ${booking.bookingServices?.[0]?.service?.title || "Service"}`,
            start: startDateTime,
            end: endDateTime,
            resource: booking,
            status: status,
          };
        });

        setBookings(formatted);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings(view, date);
  }, [view, date, API_BASE_URL]);

  // Categorize bookings and update stats
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const categorizedBookings = {
      today: [],
      upcoming: [],
      past: [],
    };

    bookings.forEach((booking) => {
      const bookingDay = new Date(booking.start);
      bookingDay.setHours(0, 0, 0, 0);

      if (bookingDay.getTime() === today.getTime()) {
        categorizedBookings.today.push(booking);
      } else if (bookingDay > today) {
        categorizedBookings.upcoming.push(booking);
      } else {
        categorizedBookings.past.push(booking);
      }
    });

    setFilteredBookings(categorizedBookings);
    setBookingStats({
      today: categorizedBookings.today.length,
      upcoming: categorizedBookings.upcoming.length,
      past: categorizedBookings.past.length,
    });
  }, [bookings]);

  // Compute daily booking counts for month view
  const dayCounts = useMemo(() => {
    const map = new Map();
    bookings.forEach((b) => {
      const key = moment(b.start).format("YYYY-MM-DD");
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [bookings]);

  // Custom Date Header for Month view
  const DateHeader = ({ label, date: cellDate }) => {
    if (view !== Views.MONTH) return <span>{label}</span>;
    const key = moment(cellDate).format("YYYY-MM-DD");
    const count = dayCounts.get(key) || 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cellDay = new Date(cellDate);

    let status = "upcoming";
    let btnClass = "bg-blue-600 hover:bg-blue-700 active:bg-blue-600"; // default upcoming
    let labelText = `Upcoming Bookings: ${count}`;

    if (cellDay.getTime() === today.getTime()) {
      status = "today";
      btnClass = "bg-green-600 hover:bg-green-700 active:bg-green-600";
      labelText = `Today Bookings: ${count}`;
    } else if (cellDay < today) {
      status = "past";
      btnClass = "bg-gray-600 hover:bg-gray-700 active:bg-gray-600";
      labelText = `Past Bookings: ${count}`;
    }

    const handleClick = () => {
      if (count > 0) {
        setView(Views.DAY); // Switch to Day view
        setDate(cellDate); // Navigate to the clicked date
      }
    };

    return (
      <div className="flex flex-col items-center h-full cursor-pointer">
        {/* Date at the top */}
        <span className="self-start">{cellDate.getDate()}</span>

        {/* Show categorized bookings button if count > 0 */}
        {count > 0 && (
          <button
            onClick={handleClick}
            type="button"
            className={`mt-20 cursor-pointer w-full 2xl:px-3 2xl:py-1 flex items-center justify-center rounded-full text-white 2xl:text-sm text-[10px] font-semibold ${btnClass}`}
          >
            {labelText}
          </button>
        )}
      </div>
    );
  };

  // Hide event titles in Month view
  const EventWrapper = ({ event, children }) => {
    if (view === Views.MONTH) return null;
    return children;
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-center mb-4">
        {/* Heading */}
        <p className="flex-grow 2xl:text-4xl md:text-2xl text-md font-extrabold text-start">
          Booking Calendar
        </p>

        {/* Booking Stats */}
        <div className="flex gap-4">
          <div className="bg-green-600 hover:bg-green-700 md:p-3 rounded-lg text-center">
            <div className="md:text-2xl text-sm font-bold text-white">
              {bookingStats.today}
            </div>
            <div className="2xl:text-sm text-[10px] text-white">
              Today Bookings
            </div>
          </div>
          <div className="bg-blue-600 hover:bg-blue-700 md:p-3 rounded-lg text-center">
            <div className="md:text-2xl text-sm font-bold text-white">
              {bookingStats.upcoming}
            </div>
            <div className="2xl:text-sm text-[10px] text-white">
              Upcoming Bookings
            </div>
          </div>
          <div className="bg-gray-600 md:p-3  hover:bg-gray-700 rounded-lg text-center">
            <div className="md:text-2xl text-sm  font-bold text-white">
              {bookingStats.past}
            </div>
            <div className="2xl:text-sm text-[10px] text-white">
              Past Bookings
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <Calendar
          localizer={localizer}
          events={bookings}
          startAccessor="start"
          endAccessor="end"
          views={[Views.DAY, Views.WEEK, Views.MONTH]}
          view={view}
          date={date}
          popup={false}
          components={{
            dateHeader: DateHeader,
            eventWrapper: EventWrapper,
            month: {
              event: () => null, // Hide events in month cells
              dateHeader: DateHeader, // Use your custom header
            },
          }}
          onView={setView}
          onNavigate={setDate}
          style={{ height: "100%" }}
          eventPropGetter={(event) => {
            let backgroundColor = "#3174ad"; // Default blue for upcoming

            if (event.status === "today") {
              backgroundColor = "#28a745"; // Green for today
            } else if (event.status === "past") {
              backgroundColor = "#6c757d"; // Gray for past
            }

            return { style: { backgroundColor } };
          }}
        />
      </div>
    </div>
  );
};

export default StaffBookingCalendar;
