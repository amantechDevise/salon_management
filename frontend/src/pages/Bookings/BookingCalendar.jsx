import React, { useEffect, useState, useMemo } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const BookingCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
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

      const response = await axios.get(
        `${API_BASE_URL}/admin/booking/calender`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          params,
        }
      );

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
          return {
            id: booking.id,
            title: `${moment(bookingTime, "HH:mm:ss").format("hh:mm A")} - ${
              booking.customer?.name || "Customer"
            } - ${booking.bookingServices?.[0]?.service?.title || "Service"}`,
            start: startDateTime,
            end: endDateTime,
            resource: booking,
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

    const handleClick = () => {
      if (count > 0) {
        setView(Views.DAY); // Switch to Day view
        setDate(cellDate);  // Navigate to the clicked date
      }
    };
    
    return (
      <div className="flex flex-col items-center justify-between h-full cursor-pointer">
        {/* Date at the top */}
        <span className="self-start">{cellDate.getDate()}</span>

        {/* Show total bookings button if count > 0 */}
        {count > 0 && (
          <button
            onClick={handleClick}
            type="button"
            className="px-3 py-1 flex items-center justify-center rounded-full text-white text-sm font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-600 cursor-pointer"
          >
            Total Bookings: {count}
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
    <div style={{ height: "90vh" }}>
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
            event: () => null,       // Hide events in month cells
            dateHeader: DateHeader,  // Use your custom header
          },
        }}
        onView={setView}
        onNavigate={setDate}
        style={{ height: "100%" }}
      />
    </div>
  );
};

export default BookingCalendar;