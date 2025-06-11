import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  headers: {
    // 'Content-Type': 'application/json',
    "Content-Type": "multipart/form-data",
  },
});

export const fetchVenueLocations = async (countryName) => {
  try {
    const response = await apiClient.get(`/locations/${countryName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching venue locations:", error);
    throw error;
  }
};

export const registerVenue = async (venueRegisterDTO) => {
  try {
    const response = await apiClient.post("/venues/register", venueRegisterDTO);
    return response.data; // Return API response data
  } catch (error) {
    console.error(
      "Error registering venue:",
      error.response?.data || error.message
    );
    throw error; // Throw error to handle it in the calling component
  }
};

export const fetchVenuesByLocationId = async (locId) => {
  try {
    const response = await apiClient.get(`/venues/location/${locId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching venue locations:", error);
    throw error;
  }
};

export const fetchAvailableSlotsByVenueId = async (venueId) => {
  try {
    const response = await apiClient.get(`/venues/slots/${venueId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching venue locations:", error);
    throw error;
  }
};

export const makeSlotRequest = async (registerSlotDto) => {
  try {
    console.log("slot req", registerSlotDto);
    const response = await apiClient.post("/slot-request", registerSlotDto, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data; // Return API response data
  } catch (error) {
    console.error(
      "Error registering venue:",
      error.response?.data || error.message
    );
    throw error; // Throw error to handle it in the calling component
  }
};

export const fetchAllSlotRequestsByVenueUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/slot-request/user/${userId}`);
    console.log("Fetched slot requests:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching venue locations:", error);
    throw error;
  }
};

export const approvedByVenue = async (slotReqId) => {
  try {
    const response = await apiClient.patch(
      `/slot-request/${slotReqId}/approve-by-venue`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching venue locations:", error);
    throw error;
  }
};
export const rejectedByVenue = async (slotReqId) => {
  try {
    const response = await apiClient.patch(
      `/slot-request/${slotReqId}/reject-by-venue`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching venue locations:", error);
    throw error;
  }
};

export const getAllSlotsForAdmin = async (slotReqId) => {
  try {
    const response = await apiClient.patch(
      `/slot-request/${slotReqId}/reject-by-venue`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching venue locations:", error);
    throw error;
  }
};

export const fetchSlotRequests = async (page = 1, limit = 20) => {
  try {
    const response = await apiClient.get("/slot-request", {
      params: { page, limit },
    });
    if (response.data.status === "success") {
      console.log("Slot Requests:", response.data.data);
      console.log("Total:", response.data.total);
      return response.data;
    } else {
      console.error("Failed to fetch slot requests:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching slot requests:", error.message);
    throw error;
  }
};

export const approvedByAdmin = async (slotReqId) => {
  try {
    const response = await apiClient.patch(
      `/slot-request/${slotReqId}/approve-by-admin`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching venue locations:", error);
    throw error;
  }
};
export const rejectedByAdmin = async (slotReqId) => {
  try {
    const response = await apiClient.patch(
      `/slot-request/${slotReqId}/reject-by-admin`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching venue locations:", error);
    throw error;
  }
};

export const fetchAllVenues = async (page = 1, limit = 20) => {
  try {
    const response = await apiClient.get("/venues", {
      params: { page, limit },
    });
    if (response.data.status === "success") {
      console.log("venues:", response.data);
      console.log("Total:", response.total);
      return {
        status: response.data.status,
        data: response.data.data,
        total: response.data.total,
      };
    } else {
      console.error("Failed to fetch slot requests:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching slot requests:", error.message);
    throw error;
  }
};

export const approvedVenueByAdmin = async (venueId) => {
  try {
    const response = await apiClient.patch(
      `/venues/${venueId}/approve-by-admin`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching venue :", error);
    throw error;
  }
};
export const rejectedVenueByAdmin = async (venueId) => {
  try {
    const response = await apiClient.patch(
      `/venues/${venueId}/reject-by-admin`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching venue :", error);
    throw error;
  }
};

export const fetchAllArtsForAdmin = async (page = 1, limit = 20) => {
  try {
    const response = await apiClient.get("/art", {
      params: { page, limit },
    });

    console.log("arts:", response.data.data);
    console.log("Total:", response.data.total);
    return response.data;
  } catch (error) {
    console.error("Error fetching slot requests:", error.message);
    throw error;
  }
};

export const approvedArtByAdmin = async (artId) => {
  try {
    const response = await apiClient.patch(`/art/${artId}/approve-by-admin`);
    return response.data;
  } catch (error) {
    console.error("Error fetching venue :", error);
    throw error;
  }
};
export const rejectArtByAdmin = async (artId) => {
  try {
    const response = await apiClient.patch(`/art/${artId}/reject-by-admin`);
    return response.data;
  } catch (error) {
    console.error("Error fetching venue :", error);
    throw error;
  }
};

export const getCountryList = async () => {
  try {
    const response = await apiClient.get("/countries");
    return response.data;
  } catch (error) {
    console.error("Error fetching country list:", error);
    throw error;
  }
};

export const fetchAllSlotsMaster = async () => {
  try {
    const response = await apiClient.get("/slots-master");
    return response.data;
  } catch (error) {
    console.error("Error fetching all slots:", error);
    throw error;
  }
};
export const fetchAllArtist = async (page = 1, limit = 100) => {
  try {
    const response = await apiClient.get("/artist", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all artists:", error);
    throw error;
  }
};

export const fetchArtsByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/art/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error registering venue:",
      error.response?.data || error.message
    );
    throw error; // Throw error to handle it in the calling component
  }
};
export const fetchReviews = async (reviewType, reviewTypeId) => {
  try {
    const response = await apiClient.get(
      `/review/by-reviewType?review_type=${reviewType}&review_type_id=${reviewTypeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    throw error;
  }
};

export const createSlotMaster = async (data) => {
  try {
    console.log("data is ", data);
    const updatedObject = {
      slot_name: data.name,
      slot_dimension: data.size,
    };
    const response = await apiClient.post(`/slots-master`, updatedObject, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.error("Error creating slot master:", error);
    throw error;
  }
};

export const fetchSlots = async () => {
  try {
    const response = await apiClient.get(`/slots-master`);
    return response;
  } catch (error) {
    console.error("Error fetching slots:", error);
    throw error;
  }
};

export const fetchVenuesByCountryName = async (page, limit, countryName) => {
  try {
    const response = await apiClient.get(`/venues`, {
      params: { page, limit, countryName },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw error;
  }
};

export const fetchArtsByVenueId = async (venueId) => {
  try {
    const response = await apiClient.get(`/slot-request/venue/${venueId}`);
    return response;
  } catch (error) {
    console.error("Error getting arts:", error.response?.data || error.message);
    throw error; // Throw error to handle it in the calling component
  }
};
export const fetchArtsByArtId = async (artId) => {
  try {
    console.log("art id", artId);
    const response = await apiClient.get(`/art/data/${artId}`);
    console.log("Fetched art data from api:", response);
    return response;
  } catch (error) {
    console.error("Error getting arts:", error.response?.data || error.message);
    throw error; // Throw error to handle it in the calling component
  }
};

export const updateArtistProfile = async (data) => {
  try {
    const response = await apiClient.put(`/artist/updateProfile`, data);
    console.log("response after updating", response);
    return response;
  } catch (error) {
    console.error("Error updating artist:", error);
    throw error;
  }
};

export const deleteArtById = async (artId) => {
  try {
    const response = await apiClient.delete(`/art/${artId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting Art with id ${artId}:`, error.message);
    throw error;
  }
};

export const updateArtById = async (artId, artData) => {
  try {
    const response = await apiClient.put(`/art/${artId}`, artData);
    return response.data;
  } catch (error) {
    console.error(`Error updating Art with id ${artId}:`, error.message);
    throw error;
  }
};

export const getArtistDataByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/artist/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching country list:", error);
    throw error;
  }
};

export const getUserDataByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching country list:", error);
    throw error;
  }
};
export const deleteSlotMasterById = async (slotMasterId) => {
  try {
    const response = await apiClient.delete(`/slots-master/${slotMasterId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting slot master with id ${slotMasterId}:`,
      error.message
    );
    throw error;
  }
};

export const updateSlotMaster = async (id, updatedSlotData) => {
  try {
    const response = await apiClient.put(
      `/slots-master/${id}`,
      updatedSlotData,
      { headers: { "Content-Type": "application/json" } }
    );
    return response;
  } catch (error) {
    console.error("Error updating artist:", error);
    throw error;
  }
};

export const getCurrenyDetailsByCountryName = async (countryName) => {
  try {
    const response = await apiClient.get(
      `/countries/currencyDetails/${countryName}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching country list:", error);
    throw error;
  }
};

export const getLocationData = async (apiURL) => {
  try {
    const response = await fetch(apiURL, {
      headers: {
        "User-Agent": "getyourarts.com (contact@getyourarts.com)", // Avoid getting blocked
      },
    });
    if (!response.ok) throw new Error("Failed to fetch location");
    return await response.json(); // Parse JSON safely
  } catch (error) {
    console.error("Error fetching geolocation data:", error);
    throw error;
  }
};



export const fetchVenuesByLatLongRadius = async (
  lat,
  long,
  distance,
  page = 0,
  limit = 20
) => {
  try {
    const response = await apiClient.get("/venues/data/nearby", {
      params: { lat, long, distance, page, limit },
    });
    if (response.data.status === "success") {
      console.log("venues:", response.data);
      console.log("Total:", response.total);
      return {
        status: response.data.status,
        data: response.data.data,
        total: response.data.total,
      };
    } else {
      console.error("Failed to fetch slot requests:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching slot requests:", error.message);
    throw error;
  }
};

export const addReviews = async (reviewDetails) => {
  try {
    const response = await apiClient.post("/review", reviewDetails, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data; // Return API response data
  } catch (error) {
    console.error(
      "Error registering venue:",
      error.response?.data || error.message
    );
    throw error; // Throw error to handle it in the calling component
  }
};

export const addTermsConditions = async (termsConditionsList) => {
  try {
    const response = await apiClient.post(
      "/ppndTnc/create",
      termsConditionsList,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data; // Return API response data
  } catch (error) {
    console.error(
      "Error adding Terms and Conditions:",
      error.response?.data || error.message
    );
    throw error; // Throw error to handle it in the calling component
  }
};

export const getTermsConditions = async (country) => {
  try {
    const response = await apiClient.get("/ppndTnc/list", {
      params: { country },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching terms:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addPrivacyPolicy = async (ppList) => {
  try {
    const response = await apiClient.post("/ppndTnc/createPP", ppList, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data; // Return API response data
  } catch (error) {
    console.error(
      "Error adding Terms and Conditions:",
      error.response?.data || error.message
    );
    throw error; // Throw error to handle it in the calling component
  }
};

export const getPrivacyPolicy = async (country) => {
  try {
    const response = await apiClient.get("/ppndTnc/listOfpp", {
      params: { country },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching terms:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Create Country
export const createCountry = async (payload) => {
  try {
    const response = await apiClient.post("/countries", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating country:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update Country
export const updateCountry = async (country) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) return;

    const response = await apiClient.post("/users/update-country", {
      userId: user._id,
      country,
    }, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating user country:", error.response?.data || error.message);
    throw error;
  }
};


// Delete Country
export const deleteCountry = async (id) => {
  try {
    const response = await apiClient.delete(`/countries/${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting country:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchAllSlotsByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/venues/allslots/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching venue locations:", error);
    throw error;
  }
};

export const updateSlotsForVenues = async (data, user_details) => {
  try {
    let currency = await getCurrenyDetailsByCountryName(user_details.country);
    let venue = await fetchVenueByUserId(user_details.id);
    data.forEach(obj => {
      obj["currency_symbol"] = currency.symbol;
      obj["currency_key"] = currency.currencyKey;
      obj["venue"] = venue.venue_id;
    });
    console.log("currency", currency);
    console.log("data is ", data);

    const response = await apiClient.post(`/venues/updateslots/venue`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.error("Error creating slot master:", error);
    throw error;
  }
};

export const fetchVenueByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/venues/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching venue locations:", error);
    throw error;
  }
};

export const updateSlotsCount = async (id, slotCount) => {
  try {
    const response = await apiClient.put(
      `/venues/update-count/${id}/${slotCount}`,
      { headers: { "Content-Type": "application/json" } }
    );
    return response;
  } catch (error) {
    console.error("Error updating artist:", error);
    throw error;
  }
};

export const fetchSupportTicketForAdmin = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(`/contacts`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    throw error;
  }
};
export const paymentForArt = async ({
  amount,
  currency,
  customerEmail,
  productname,
  artId,
  userId,
  currencySymbol
}) => {
  try {

    console.log("before calling payment api", {
      amount,
      currency,
      customerEmail,
      productname,
      artId,
      userId,
      currencySymbol
    });

    const response = await apiClient.post(`/payment/checkoutart`, {
      amount,
      currency,
      customerEmail,
      productname,
      artId,
      userId,
      currencySymbol
    }, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.error("Error creating slot master:", error);
    throw error;
  }
};

export const paymentForSlotReq = async ({
  amount,
  currency,
  customerEmail,
  productname,
  slotId,
  userId,
  currencySymbol,
  meta
}) => {
  try {

    const response = await apiClient.post(`/payment/checkoutslot`, {
      amount,
      currency,
      customerEmail,
      productname,
      slotId,
      userId,
      currencySymbol,
      meta
    }, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("venue paymnent ", response)
    return response;
  } catch (error) {
    console.error("Error creating slot master:", error);
    throw error;
  }
};

export const fetchCustomerDashboard = async (userId) => {
  try {
    const response = await apiClient.get(`/payment/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer dashboard:", error);
    throw error;
  }
};
export const updateUserProfile = async (data,userId) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, data, { headers: { "Content-Type": "application/json" } }
    );
    console.log("response after updating", response);
    return response;
  } catch (error) {
    console.error("Error updating artist:", error);
    throw error;
  }
};

export const venueslotRegister = async (registerSlotDto) => {
  try {
    const response = await apiClient.post("/venue-slots-request", registerSlotDto);
    return response.data; // Return API response data
  } catch (error) {
    console.error(
      "Error registering venue:",
      error.response?.data || error.message
    );
    throw error; // Throw error to handle it in the calling component
  }
};

export const fetchVenueSlotsByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/venue-slots-request/findByVenueUserId/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching venue locations:", error);
    throw error;
  }
};

export const fetchAllAddedSlotsForAdmin = async (page, limit, fetch_status) => {
  try {
    // fetch_status = 0 // dont fetch slots having status =3 
    // fetch_status = 1 // dont fetch slots having status =0
    const response = await apiClient.post(`/venue-slots-request/findAllForAdmin`, { page, limit ,fetch_status}, { headers: { "Content-Type": "application/json" }});
    return response.data;
  } catch (error) {
    console.error("Error fetching all added slots for admin:", error);
    throw error;
  }
};

export const updateStatus = async (id, status) => {
  try {
    const response = await apiClient.get(`/venue-slots-request/updateStatus/${id}/${status}`);
    return response.data;
  } catch (error) {
    console.error("Error updating status:", error.message);
    throw error;
  }
};

export const venueSlotUpdate = async (registerSlotDto) => {
  try {
    const response = await apiClient.put("/venue-slots-request", registerSlotDto);
    return response.data; // Return API response data
  } catch (error) {
    console.error(
      "Error registering venue:",
      error.response?.data || error.message
    );
    throw error; // Throw error to handle it in the calling component
  }
};

export const getVenueSlotById = async (id) => {
  try {
    const response = await apiClient.get(`/venue-slots-request/findById/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error updating status:", error.message);
    throw error;
  }
};
