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
            <Route path="update-profile" element={<UpdateProfile />} />
            <Route path="staff" element={<ListStaff />} />
            <Route path="staff/add" element={<AddStaff />} />
            <Route path="staff/:id" element={<ViewStaff />} />
              <Route path="customer" element={<ListCustomer />} />
            <Route path="customer/add" element={<AddCustomer />} />
            <Route path="services" element={<Listing />} />
                      <Route path="services/add" element={<AddServices />} />
          </Route>

            <Route path="/admin/staff-login" element={<StaffLogin />} />
        
          <Route
            path="/staffadmin"
            element={
              <StaffPrivateRoute>
             
                <StaffLayouts />
              </StaffPrivateRoute>
            }
          >
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="services" element={<ListServices />} />
              <Route path="customer" element={<ListStaffCustomer />} />
            <Route path="customer/add" element={<AddstaffCustomer />} />
          </Route>



        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
