import React, { useState,useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isBefore,
  isAfter,
  isSameDay,
  startOfDay,
} from "date-fns";
import PhoneInput from 'react-phone-input-2';
import { Store } from "lucide-react";
import { fetchVenueLocations , fetchVenuesByLocationId, fetchAvailableSlotsByVenueId , makeSlotRequest} from "../services/ApiService"
import {mapFormDataToSlotRequest} from  "../utilities/Utility"

const FindVenue = () => {
  const navigate = useNavigate();
  const today = startOfDay(new Date());

  const [currentMonth, setCurrentMonth] = useState(today);
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(today);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));

  const [cartItems, setCartItems] = useState([]);
const [cartOpen, setCartOpen] = useState(false);


  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    name: '',
    surname: '',
    catalogLink: '',
    dimensions: '',
    medium: '',
    mounted: '',
    artImage : null,
    // Add more fields as needed
  });
  const [locations, setLocations] = useState([]);
  const [venues, setVenues] = useState([]);
  const [availableSlots , setAvailableSlots] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  useEffect(() => {
    const countryName= localStorage.getItem("selectedCountry");
    if(!countryName){
      navigate("/choosecountry");
    }
    fetchVenueLocations(countryName).then((backendResponse) => {
            console.log("response is ,", backendResponse);
            const transformedLocations = backendResponse.map((item) => ({
              id: item.id,
              location: item.location,
            }));
            setLocations(transformedLocations);
    });
    const loggedInUserh =localStorage.getItem("user");
    if (!loggedInUserh) {
      alert("Login required.");
      navigate("/login");
    }
    const parsedUser = JSON.parse(loggedInUserh);
    console.log("user", parsedUser);
    setLoggedInUser(parsedUser);
  },[]);
  
  const handleBookingConfirmation = async () => {
    console.log("formdata ", formData);
  
    const updatedCartItems = [];
    let isComplete = true;
  
    for (let slotRequest of cartItems) {
      try {
        const res = await makeSlotRequest(slotRequest); // Wait for the result
        console.log("slot registered successfully", res);
      } catch (ex) {
        isComplete = false;
        updatedCartItems.push(slotRequest); // Only push to the array on error
        console.error("error while registering slot", ex);
      }
    }
 
  
  if (!isComplete) {
    alert(`Some bookings couldn't be processed. Please review your cart.`);
  } else {
    console.log("All bookings processed successfully", updatedCartItems);
    alert("Booking confirmed successfully !");
  }
  setCartItems(updatedCartItems);
  setStep(1);
 }

  const steps = [
    "Location",
    "Venue Name",
    "Painting Slots",
    "Service Extras",
    "Date & Time",
    "Information",
    "Cart",
    "Confirmation",
  ];

  const handleLocSelect = (loc) => {
    setSelectedLocation(loc);
    setStep(2);

    fetchVenuesByLocationId(loc.id).then(res => {
      console.log("venues ",res);
      setVenues(res);
    }).catch(ex => {
      alert("Something went wrong !")
    });
  };

  const handleStaffSelect = (staffMember) => {
    setSelectedStaff(staffMember);
 

    fetchAvailableSlotsByVenueId(staffMember.venue_id).then(res => {
      setAvailableSlots(res);
    }).catch(ex =>{
      console.log("error while fetching slots in venue", ex);
    });
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep(4);
  };
 const addToCart = () => {
  console.log("user id from mapping",loggedInUser);
  let slotRequest = mapFormDataToSlotRequest(formData, selectedLocation, selectedSlot, calendarSelectedDate,selectedStaff,loggedInUser);
  setCartItems((prevCartItems) => [...prevCartItems, slotRequest]);
  setCartOpen(true);
  setFormData({
    phone: '',
    email: '',
    name: '',
    surname: '',
    catalogLink: '',
    dimensions: '',
    medium: '',
    mounted: '',
    artImage : null,
    // Add more fields as needed
  });
  setSelectedLocation(null);
  setSelectedStaff(null);
  setSelectedSlot(null);
  setCalendarSelectedDate(today);
  setStep(1);
  console.log("cart items ",cartItems);
 };
 const finalStep = () => {
  addToCart();
  setStep(step + 1)
 };
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });

    const isInRange = (date) => {
      const rangeEnd = addDays(calendarSelectedDate, 29);
      return (
        isAfter(date, addDays(calendarSelectedDate, -1)) &&
        isBefore(date, addDays(rangeEnd, 1))
      );
    };
    

    const handleDateClick = (date) => {
      if (!isBefore(date, today)) {
        setCalendarSelectedDate(startOfDay(date));
      }
    };

    const nextMonth = () =>
      setCurrentMonth(addDays(endOfMonth(currentMonth), 1));
    const prevMonth = () =>
      setCurrentMonth(addDays(startOfMonth(currentMonth), -1));

    const weeks = [];
    let day = startDate;

    while (day <= monthEnd || weeks.length < 6) {
      const days = [];

      for (let i = 0; i < 7; i++) {
        const isDisabled = !isSameMonth(day, currentMonth) || isBefore(day, today);
        const isSelected = isInRange(day);

        days.push(
          <div
            key={day.toString()}
            className={`w-10 h-10 flex items-center justify-center border rounded text-sm font-medium
              ${isDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-800 cursor-pointer hover:bg-gray-200"}
              ${isSelected ? "border-b-4 border-green-500" : ""}
            `}
            onClick={() => !isDisabled && handleDateClick(day)}
          >
            {format(day, "d")}
          </div>
        );

        day = addDays(day, 1);
      }

      weeks.push(
        <div key={day.toString()} className="flex gap-2 justify-center">
          {days}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl p-6 shadow-md max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth}>&lt;</button>
          <h2 className="text-lg font-semibold text-gray-800">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button onClick={nextMonth}>&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-sm text-gray-600 mb-2 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-medium">{day}</div>
          ))}
        </div>
        <div className="space-y-1">{weeks}</div>

        {/* Display selected date range */}
        <div className="text-center mt-4 text-sm text-gray-700">
          {format(calendarSelectedDate, "EEE, MMM d")} —{" "}
          {format(addDays(calendarSelectedDate, 29), "EEE, MMM d")}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#f5f2ea] p-8">
      {/* Sidebar */}
      <div className="w-1/4 bg-[#1e1e1e] text-white p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-bold mb-6 text-[#e3c27e]">BOOK A VENUE</h2>
        <ul className="space-y-4">
          {steps.map((stepLabel, index) => (
            <li
              key={index}
              className={`p-2 rounded flex items-center transition-all ${
                step > index + 1
                  ? "text-[#e3c27e]"
                  : step === index + 1
                  ? "text-white"
                  : "text-gray-500"
              }`}
            >
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full font-semibold mr-3 ${
                  step > index + 1
                    ? "bg-[#e3c27e] text-white"
                    : step === index + 1
                    ? "bg-[#555] text-white"
                    : "bg-[#2f2f2f]"
                }`}
              >
                {index + 1}
              </span>
              {stepLabel}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 bg-white p-8 ml-8 rounded-xl shadow-lg">



        {/* Step 1: Location */}
        {step === 1 && (
          <>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">
              Select Location
            </h1>
            <div className="grid grid-cols-3 gap-6">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className={`border-2 p-6 rounded-xl text-center cursor-pointer shadow-sm transition-all ${
                    selectedLocation?.id === loc.id
                      ? "border-[#e3c27e] bg-[#fff8e6]"
                      : "hover:bg-gray-100 border-gray-300"
                  }`}
                  onClick={() => handleLocSelect(loc)}
                >
                  <FaMapMarkerAlt className="text-3xl text-[#888] mx-auto mb-2" />
                  <h2 className="text-lg font-semibold">{loc.location}</h2>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 2: Staff */}
        {step === 2 && (
          <>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">
              Select Staff
            </h1>
            <div className="grid grid-cols-2 gap-6">
              {venues.map((member) => (
                <div
                  key={member.venue_id}
                  className={`p-6 rounded-xl shadow-md cursor-pointer border-2 transition-all ${
                    selectedStaff?.venue_id === member.venue_id
                      ? "border-[#e3c27e] bg-[#fffaf0]"
                      : "hover:bg-gray-100 border-gray-300"
                  }`}
                  onClick={() => handleStaffSelect(member)}
                >
                  <img
                    src={member.venue_photo}
                    alt={member.venue_name}
                    className="w-20 h-20 object-cover rounded-full mx-auto mb-4"
                  />
                  <h2 className="text-center text-lg font-semibold mb-1">
                    {member.venue_name}
                  </h2>
                  <p className="text-center text-sm text-gray-600">
                    {member.owner.email}
                  </p>
                  <p className="text-center text-sm text-gray-600">
                    {member.owner.phone}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-8">
              <button
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setStep(1)}
              >
                BACK
              </button>
              {selectedStaff && (
                <button
                  className="px-6 py-2 bg-[#e3c27e] text-white rounded hover:bg-[#d0ae63]"
                  onClick={() => setStep(3)}
                >
                  NEXT STEP
                </button>
              )}
            </div>
          </>
        )}



        {/* Step 3: Painting Slots */}
        {step === 3 && (
          <>
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              Select Service
            </h1>
            {/* <h2 className="text-lg font-medium text-[#e3c27e] mb-6">
              {selectedSlot!=null ? selectedSlot.slot_name : ""}
            </h2> */}
            <div className="space-y-4">
              {availableSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-4 border rounded-lg shadow flex justify-between items-center bg-[#fcfcf9] cursor-pointer"
                  onClick={() => handleSlotSelect(slot)}
                >
                  <div>
                    <h3 className="text-lg font-semibold">
                       {slot.slot_name} 
                    </h3>
                    <span className="text-sm bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                      {slot.slot_dimension}
                    </span>
                  </div>
                  <span className="text-green-600 font-bold text-lg">
                   {slot.slot_price}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-8">
              <button
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setStep(2)}
              >
                BACK
              </button>
            </div>
          </>
        )}


        {/* Step 4: Service Extras */}
        {step === 4 && selectedSlot && (
          <>
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              Select Service Extras
            </h1>
            <div className="p-4 border rounded-lg shadow bg-[#fcfcf9] mt-4">
              <h3 className="text-base font-medium">
                HANDLING CHARGES FOR SLOT {selectedSlot.slot_name}
              </h3>
              <span className="text-green-600 font-bold text-lg"> {import.meta.env.VITE_SERVICE_EXTRAS}</span>
            </div>
            <div className="flex justify-between mt-8">
              <button
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setStep(3)}
              >
                BACK
              </button>
              <button
                className="px-6 py-2 bg-[#e3c27e] text-white rounded hover:bg-[#d0ae63]"
                onClick={() => setStep(5)}
              >
                NEXT STEP
              </button>
            </div>
          </>
        )}

{/* STEP 5 DATE AND TIME        */}

{step === 5 && (
  <>
    <h1 className="text-3xl font-semibold text-gray-800 mb-6">Select Date</h1>
    <div className="bg-white rounded-xl p-6 shadow-md max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentMonth(addDays(startOfMonth(currentMonth), -1))}>
          &lt;
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button onClick={() => setCurrentMonth(addDays(endOfMonth(currentMonth), 1))}>
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-sm text-gray-600 mb-2 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-medium">{day}</div>
        ))}
      </div>
      <div className="space-y-1">
      {(() => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const weeks = [];
  let day = startDate;

  const isInRange = (date) => {
    const rangeEnd = addDays(calendarSelectedDate, 29);
    return isAfter(date, addDays(calendarSelectedDate, -1)) &&
           isBefore(date, addDays(rangeEnd, 1));
  };

  while (day <= monthEnd || weeks.length < 6) {
    const days = [];
    const weekStart = day; // <-- Capture before mutation
  
    for (let i = 0; i < 7; i++) {
      const currentDay = day; // 🔥 freeze day here before it's mutated
    
      const isDisabled = !isSameMonth(currentDay, currentMonth) || isBefore(currentDay, today);
      const isSelected = isInRange(currentDay);
    
      days.push(
        <div
          key={currentDay.toString()}
          className={`w-10 h-10 flex items-center justify-center border rounded text-sm font-medium
            ${isDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-800 cursor-pointer hover:bg-gray-200"}
            ${isSelected ? "border-b-4 border-[#f4e15d]" : ""}
          `}
          onClick={() => !isDisabled && setCalendarSelectedDate(startOfDay(currentDay))}
        >
          {format(currentDay, "d")}
        </div>
      );
    
      day = addDays(day, 1); // ✅ mutate AFTER push
    }


    weeks.push(
      <div key={weekStart.toString()} className="flex gap-2 justify-center">
        {days}
      </div>
    );
  }
  return weeks;
})()}
  </div>

      {/* Show Selected Range */}
      <div className="mt-4 text-center text-sm text-gray-700 font-medium">
        {`Selected: ${format(calendarSelectedDate, "EEE, MMM d")} — ${format(addDays(calendarSelectedDate, 29), "EEE, MMM d")}`}
      </div>
      <div className="flex justify-between mt-6">
        <button
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          onClick={() => setStep(4)}
        >
          BACK
        </button>
        <button
          className="px-6 py-2 bg-[#e3c27e] text-white rounded hover:bg-[#d0ae63]"
          onClick={() => setStep(6)}
        >
          NEXT STEP
        </button>
      </div>
    </div>
  </>
)}

{/* STEP 6 FORM */}
{step === 6 && (
  <div className="w-full bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-md">
    <h2 className="text-3xl font-semibold text-gray-800 mb-6">
      Fill Information
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e3c27e]"
        />
      </div>

      {/* Phone */}
      <div>
        <PhoneInput
          country={'us'}
          enableSearch
          value={formData.phone}
          onChange={(value) => setFormData({ ...formData, phone: value })}
          inputClass="!w-full !border !border-gray-300 !rounded-lg !px-4 !py-2 focus:!ring-2 focus:!ring-[#e3c27e]"
          buttonClass="!border !border-r-0 !border-gray-300 !rounded-l px-2"
          dropdownClass="!border !border-gray-300 !rounded !shadow-lg"
          containerClass="w-full"
        />
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e3c27e]"
        />
      </div>

      {/* Surname */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Surname *
        </label>
        <input
          type="text"
          value={formData.surname}
          onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e3c27e]"
        />
      </div>

      {/* Catalog Link */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Please put your ART Catalog Link *
        </label>
        <input
          type="url"
          value={formData.catalogLink}
          onChange={(e) =>
            setFormData({ ...formData, catalogLink: e.target.value })
          }
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e3c27e]"
        />
      </div>

      {/* Art Image Upload */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Attach Art Image *
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({ ...formData, artImage: e.target.files[0] })
          }
          className="block w-full text-sm text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#e3c27e] file:text-white hover:file:bg-[#d0ae63]"
        />
      </div>

      {/* Dimensions */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What is the dimensions of the art? *
        </label>
        <input
          type="text"
          value={formData.dimensions}
          onChange={(e) =>
            setFormData({ ...formData, dimensions: e.target.value })
          }
          placeholder="e.g. 30in x 40in"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e3c27e]"
        />
      </div>

      {/* Medium */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What is the medium of the art? *
        </label>
        <input
          type="text"
          value={formData.medium}
          onChange={(e) =>
            setFormData({ ...formData, medium: e.target.value })
          }
          placeholder="e.g. Acrylic, oil, etc."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e3c27e]"
        />
      </div>

      {/* Mounted */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Is your art mounted? *
        </label>
        <div className="flex items-center gap-6 mt-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="mounted"
              value="yes"
              checked={formData.mounted === 'yes'}
              onChange={() =>
                setFormData({ ...formData, mounted: 'yes' })
              }
              className="form-radio text-[#e3c27e] focus:ring-[#e3c27e]"
            />
            <span className="ml-2 text-gray-700">Yes, It is mounted</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="mounted"
              value="no"
              checked={formData.mounted === 'no'}
              onChange={() =>
                setFormData({ ...formData, mounted: 'no' })
              }
              className="form-radio text-[#e3c27e] focus:ring-[#e3c27e]"
            />
            <span className="ml-2 text-gray-700">No, It's not mounted</span>
          </label>
        </div>
      </div>
    </div>

    {/* Buttons */}
    <div className="flex justify-between mt-8">
      <button
        onClick={() => setStep(step - 1)}
        className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg shadow hover:bg-gray-300 transition"
      >
        BACK
      </button>
      <button
        onClick={() =>   setStep(step + 1)  }
        className="bg-[#e3c27e] text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-[#d0ae63] transition"
      >
        NEXT STEP
      </button>
    </div>
  </div>
)}


       {/* Step 7: Cart */}
{step === 7 && (
  <div className="w-full">
    <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add to Cart</h1>

    {/* Booking Card */}
    <div className="border-2 border-green-400 p-6 rounded-xl bg-white shadow-md max-w-md">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-bold text-gray-800">
           {(selectedSlot?.slot_name + " - "+ selectedStaff?.venue_name) || "N/A"}
        </h2>
        <div className="relative group">
          <button className="text-gray-500 hover:text-red-500">
            ⋮
          </button>
          <div className="absolute right-0 mt-1 hidden group-hover:block bg-white border rounded-lg shadow-lg">
            <button className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 w-full">
              🗑️ Remove
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm mb-1">
        <strong>Venue Name:</strong> {selectedStaff.venue_name || "N/A"}
      </p>
      <p className="text-sm mb-1">
        <strong>Location:</strong> {selectedLocation.location || "N?A"}
      </p>
      <p className="text-sm mb-1">
        <strong>Date & Time:</strong> { selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
      </p>
      <p className="text-sm">
        <strong>Amount:</strong>{" "}
        <span className="text-green-600 font-medium">
        {isNaN(Number(selectedSlot.slot_price)) || isNaN(Number(import.meta.env.VITE_SERVICE_EXTRAS)) 
              ? 'Invalid price' 
              : (Number(selectedSlot.slot_price) + Number(import.meta.env.VITE_SERVICE_EXTRAS)).toFixed(2)}
        
        </span>
        <span className="ml-1 text-sm text-gray-400">ℹ️</span>
      </p>
    </div>

    {/* Action Buttons */}
    <div className="flex justify-between mt-8">
      <button
        className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        onClick={() => setStep(6)}
      >
        BACK
      </button>

      <div className="flex gap-4">
      <button
  className="flex items-center gap-2 px-4 py-2 bg-white border border-green-400 text-green-600 rounded shadow hover:shadow-md"
  onClick={() => addToCart()}
>
  ➕ Add new Booking
</button>


        <button
          className="px-6 py-2 bg-[#e3c27e] text-white rounded hover:bg-[#d0ae63]"
          onClick={() => finalStep()}
        >
          NEXT STEP
        </button>
      </div>
    </div>
  </div>
)}


        {/* Step 8: Confirmation */}
{step === 8 && (
  <div className="w-full">
    <h1 className="text-2xl font-semibold text-gray-800 mb-6">Confirm Details</h1>

    {/* Booking Details Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2">

      {/* Left Column */}
      <div className="space-y-4">

        {/* Date & Location Summary */}
        {cartItems.map((item, index) => (
       <div className="bg-white shadow rounded-xl p-6 border border-gray-200">
       {/* Date & Location Summary */}
       <div className="bg-white shadow rounded-xl p-4 border border-gray-200 mb-4">
         <div className="grid grid-cols-2 gap-2 text-sm">
           <p>
             <span className="text-[#e3c27e] font-semibold">Date & Time:</span>{" "}
             <span className="text-gray-700">{item.request_date || ""}</span>
           </p>
           <p>
             <span className="text-[#e3c27e] font-semibold">Venue Name:</span>{" "}
             <span className="text-gray-700">{item.venue_name || "N/A"}</span>
           </p>
           <p>
             <span className="text-[#e3c27e] font-semibold">Location:</span>{" "}
             <span className="text-gray-700">{item.location_name || "N/A"}</span>
           </p>
           <p>
             <span className="text-[#e3c27e] font-semibold">Painting Slots:</span>{" "}
             <span className="text-gray-700">
               {item.slot_name  || "N/A"}
             </span>
           </p>
         </div>
       </div>
     
       {/* Pricing Summary */}
       <div className="bg-white border border-gray-200 rounded-xl shadow p-4">
         <p className="font-medium text-gray-800">
            {item.slot_name -  item.venue_name || "N/A"}
         </p>
     
         <div className="mt-3 space-y-1 text-sm">
           <div className="flex justify-between">
             <span className="text-gray-600">Base Price</span>
             <span className="text-green-600 font-semibold">{item.slot_price || "N/a"}</span>
           </div>
           <div className="flex justify-between">
             <span className="text-gray-600">Handling Charges for Slot 1 [x1]</span>
             <span className="text-green-600 font-semibold">{item.service_charge}</span>
           </div>
           <div className="flex justify-between">
             <span className="text-orange-500">Discount</span>
             <span className="text-gray-500">0.00</span>
           </div>
         </div>
     
         <div className="mt-4 border-t pt-2 flex justify-between items-center text-green-700 font-semibold bg-green-50 rounded px-2 py-1">
           <span>Total Price</span>
           <span>
            {isNaN(Number(item.slot_price)) || isNaN(Number(item.service_charge)) 
              ? 'Invalid price' 
              : (Number(item.slot_price) + Number(item.service_charge)).toFixed(2)}
          </span>
         </div>
       </div>
     </div>
     
        ))}
      </div>
  
      {/* Right Column – Local Tag */}
      <div className="flex justify-center items-center">
        <div className="w-40 h-40 border border-green-400 rounded-lg flex flex-col justify-center items-center text-center">
        <Store className="w-10 h-10 text-green-500" /> 
          <p className="text-gray-800 font-semibold mt-2">Local</p>
        </div>
      </div>
    </div>

    {/* Buttons */}
    <div className="flex justify-between mt-8">
      <button
        className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        onClick={() => setStep(7)}
      >
        BACK
      </button>

      <button
        className="px-6 py-2 bg-[#e3c27e] text-white rounded hover:bg-[#d0ae63] shadow-md"
        onClick={() => handleBookingConfirmation()}
      >
        CONFIRM BOOKING
      </button>
    </div>
  </div>
)}

{/* Floating Cart Icon */}
<div className="fixed bottom-6 right-6 z-50">
  <button
    onClick={() => setCartOpen(true)}
    className="bg-[#e3c27e] text-white p-3 rounded-full shadow-lg hover:bg-[#d0ae63]"
    title="View Cart"
  >
    🛒
    {cartItems!=null && cartItems.length > 0 && (
      <span className="absolute top-[-6px] right-[-6px] bg-red-600 text-white text-xs rounded-full px-1">
        {cartItems.length}
      </span>
    )}
  </button>
</div>

{/* Cart Drawer */}
{cartOpen && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end">
    <div className="bg-white w-96 h-full p-6 shadow-lg overflow-y-auto relative">

      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
        onClick={() => setCartOpen(false)}
      >
        ✖
      </button>

      <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>

      {cartItems!=null && cartItems.length === 0 ? (
        <p className="text-gray-500">No bookings added yet.</p>
      ) : (cartItems!=null && 
        cartItems.map((item, index) => (
          <div key={index} className="border p-4 rounded-lg shadow mb-4 bg-gray-50 relative">
            <button
              onClick={() => {
                const updated = [...cartItems];
                updated.splice(index, 1);
                setCartItems(updated);
              }}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              title="Remove"
            >
              🗑️
            </button>
            <p><strong>First Name:</strong> {item.name || "N/A"}</p>
            <p><strong>Venue:</strong> {item.venue_name || "N/A"}</p>
            <p><strong>Location:</strong> {item.location_name || "N/A"}</p>
            <p><strong>Date:</strong> {item.request_date || "N/A"}</p>
            <p><strong>Email:</strong> {item.email || "N/A"}</p>
            <p><strong>Phone:</strong> {item.phone || "N/A"}</p>
            <p><strong>Amount:</strong> <span className="text-green-600 font-medium">{item.service_charge || "N/A"}</span></p>
          </div>
        ))
      )}

      {cartItems!=null && cartItems.length > 0 && (
        <button
          className="w-full py-2 bg-[#4a9d8f] text-white rounded hover:bg-[#3e857a] mt-4"
          onClick={() => {
            setCartOpen(false);
            setStep(8); // Go to checkout or confirmation step
          }}
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  </div>
)}



      </div>
    </div>
  );
};

export default FindVenue;
