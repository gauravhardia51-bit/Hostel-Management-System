import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import './HomePage.css';

export function HomePage(){
   return(
    <>
  <title>Hostel-Management</title>
    

    <Header/>

   <div className='header'>
             {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Hostel Management System</h1>
        <p>Manage rooms, students, and bookings easily.</p>
        <button className="button-primary">Book Room</button>
        <button className="button-secondary">View Rooms</button>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div>
          <h3>120</h3>
          <p>Total Rooms</p>
        </div>
        <div>
          <h3>45</h3>
          <p>Available</p>
        </div>
        <div>
          <h3>75</h3>
          <p>Occupied</p>
        </div>
        <div>
          <h3>150</h3>
          <p>Students</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Features</h2>

        <div className="feature-box">
          <h4>Room Booking</h4>
          <p>Easy room allocation and booking system.</p>
        </div>

        <div className="feature-box">
          <h4>Student Management</h4>
          <p>Track student records efficiently.</p>
        </div>

        <div className="feature-box">
          <h4>Fee Management</h4>
          <p>Handle payments and dues easily.</p>
        </div>

        <div className="feature-box">
          <h4>Complaint System</h4>
          <p>Register and resolve complaints.</p>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="rooms">
        <h2>Available Rooms</h2>

        <div className="room-card">
          <h3>Room 101</h3>
          <p>Type: Single</p>
          <p>Price: ₹3000/month</p>
          <button className="button-primary">Book Now</button>
        </div>

        <div className="room-card">
          <h3>Room 102</h3>
          <p>Type: Double</p>
          <p>Price: ₹5000/month</p>
          <button className="button-primary">Book Now</button>
        </div>
      </section>

        </div>
        <Footer/>
</>
   ) 
};