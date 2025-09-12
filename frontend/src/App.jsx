import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AdminLayouts from "./pages/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./auth/Login";
import AdminPrivateRoute from "./context/AdminPrivateRoute";
import UserProfile from "./pages/Users/UserProfile";
import UpdateProfile from "./pages/Users/UpdateProfile";
import ListStaff from "./pages/Staff/ListStaff";
import AddStaff from "./pages/Staff/AddStaff";
import { ToastContainer } from "react-toastify";
import ListCustomer from "./pages/customers/ListCustomer";
import AddCustomer from "./pages/customers/AddCustomer";
import StaffLogin from "./auth/StaffLogin";
import StaffPrivateRoute from "./context/StaffPrivateRoute";
import StaffDashboard from "./pages/StaffDashboard/Dashboard";
import AddstaffCustomer from "./pages/StaffDashboard/customers/AddCustomer";
import ListStaffCustomer from "./pages/StaffDashboard/customers/ListCustomer";
import StaffLayouts from "./pages/StaffDashboard/AdminLayout";
import ListServices from "./pages/StaffDashboard/services/ListServices";
import Listing from "./pages/Services/Listing";
import AddServices from "./pages/Services/AddServices";
import ViewStaff from "./pages/Staff/ViewStaff";
import ViewCustomer from "./pages/customers/ViewCustomer";
import ListBooking from "./pages/Bookings/Listing";
import AddBooking from "./pages/Bookings/AddBooking";
import BookingList from "./pages/StaffDashboard/StaffBookings/BookingList";
import BookingAdd from "./pages/StaffDashboard/StaffBookings/BookingAdd";
import UpdatestaffProfile from "./pages/StaffDashboard/Users/UpdateProfile";
import UserstaffProfile from "./pages/StaffDashboard/Users/UserProfile";
import ListAttendance from "./pages/StaffDashboard/Attendance/ListAttendance";
import AttendanceList from "./pages/Staff/AttendanceList";
import EditServices from "./pages/Services/EditServices";
import Feedlisting from "./pages/StaffDashboard/Feedback/Feedlisting";
import ListingPackage from "./pages/ServicesPackage/ListingPackage";
import AddPackage from "./pages/ServicesPackage/AddPackage";
import ListStaffPackage from "./pages/StaffDashboard/services/ListingPackage";
import ListingDiscount from "./pages/Discounts/listing";
import AddDiscount from "./pages/Discounts/add";
import BookingCalendar from "./pages/Bookings/BookingCalendar";
import Invoice from "./pages/Invoices/listInvoice";
import Staff_Invoice from "./pages/StaffDashboard/Invoices/listInvoice";
import PasswordChange from "./pages/Users/PasswordChange";
import Password_Change from "./pages/StaffDashboard/Users/PasswordChange";
import StaffBookingCalendar from "./pages/StaffDashboard/StaffBookings/BookingCalendar";
import StaffList from "./pages/StaffDashboard/Users/listingStaff";
import StaffAdd from "./pages/StaffDashboard/Users/AddStaff";
import StaffView from "./pages/StaffDashboard/Users/ViewStaff";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <AdminPrivateRoute>
                {" "}
                <AdminLayouts />
              </AdminPrivateRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="change_password" element={<PasswordChange />} />
            <Route path="update-profile" element={<UpdateProfile />} />
            <Route path="staff" element={<ListStaff />} />
            <Route path="staff/add" element={<AddStaff />} />
            <Route path="staff/:id" element={<ViewStaff />} />
            <Route path="customer" element={<ListCustomer />} />
            <Route path="customer/add" element={<AddCustomer />} />
            <Route path="view/:id" element={<ViewCustomer />} />
            <Route path="services" element={<Listing />} />
            <Route path="services/add" element={<AddServices />} />
            <Route path="services/:id" element={<EditServices />} />
            <Route path="packages" element={<ListingPackage />} />
            <Route path="packages/add" element={<AddPackage />} />
            <Route path="bookings" element={<ListBooking />} />
            <Route path="bookings/calendar" element={<BookingCalendar />} />
            <Route path="bookings/add" element={<AddBooking />} />
            <Route path="discounts" element={<ListingDiscount />} />
            <Route path="discounts/add" element={<AddDiscount />} />
            <Route path="attendance/:id" element={<AttendanceList />} />
            <Route path="generate_Invoice/:booking_id" element={<Invoice />} />
          </Route>

          <Route path="/admin/staff-login" element={<StaffLogin />} />

          <Route
            path="/staff-Admin"
            element={
              <StaffPrivateRoute>
                <StaffLayouts />
              </StaffPrivateRoute>
            }
          >
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="profile" element={<UserstaffProfile />} />
            <Route path="staff" element={<StaffList />} />
            <Route path="staff/add" element={<StaffAdd />} />
             <Route path="staff/:id" element={<StaffView />} />
            <Route path="update-profile" element={<UpdatestaffProfile />} />
            <Route path="services" element={<ListServices />} />
            <Route path="packages" element={<ListStaffPackage />} />
            <Route path="change_password" element={<Password_Change />} />
            <Route path="customer" element={<ListStaffCustomer />} />
            <Route path="customer/add" element={<AddstaffCustomer />} />
            <Route path="bookings" element={<BookingList />} />
            <Route path="bookings/add" element={<BookingAdd />} />
            <Route path="attendance" element={<ListAttendance />} />
            <Route path="bookings/calendar" element={<StaffBookingCalendar />} />
            <Route
              path="generate_Invoice/:booking_id"
              element={<Staff_Invoice />}
            />
          </Route>
          <Route
            path="/staff-Admin/feedback/:staffName/:token"
            element={<Feedlisting />}
          />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
