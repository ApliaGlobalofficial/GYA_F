import { getUserDataByUserId } from "../services/ApiService";
import { format } from "date-fns";
import { Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css";

export const mapFormDataToRegisterVenueEntity = (
  formData,
  slotsData,
  selectedCountry,
  selectedSuggestion
) => {
  return {
    firstname: formData.firstName,
    email: formData.email,
    password: formData.password,
    phone: formData.phoneNumber,
    venue_name: formData.venueName,
    venue_address: formData.venueAddress,
    registered_company_name: formData.registeredCompanyName,
    registered_address: formData.registeredAddress,
    company_type: formData.companyType,
    venue_photo: formData.venuePhoto, // Assuming the photo is a valid object or URL
    location_photo: formData.locationPhoto,
    venue_established_date: formData.establishedDate
      ? new Date(formData.establishedDate).toISOString().split("T")[0]
      : null,
    company_trading_since: formData.tradingSince
      ? new Date(formData.tradingSince).toISOString().split("T")[0]
      : null,
    venue_type: formData.venueType,
    venue_theme: formData.venueTheme,
    venue_desc: formData.venueDescription,
    website: formData.website,
    slots: slotsData,
    kind_of_art: formData.artType,
    consideration_for_displayed_art: formData.displayConsiderations,
    how_did_you_hear_about_us: formData.referralSource,
    sign_up_for_newsletter: formData.newsletter,
    city: formData.venueLocation,
    countryName: selectedCountry,
    venue_location: selectedSuggestion,
  };
};

export const mapFormDataToSlotRequest = (
  formData,
  selectedLocation,
  selectedSlot,
  selectedDate,
  selectedStaff,
  loggedInUser
) => {
  return {
    location_id: selectedLocation ? selectedLocation.id : null, // Assuming selectedLocation has an 'id'
    venue_id: selectedStaff ? selectedStaff.venue_id : null, // Assuming selectedLocation has 'venueId'
    slot_id: selectedSlot ? selectedSlot.id : null, // Assuming selectedSlot has an 'id'
    service_charge: import.meta.env.VITE_SERVICE_EXTRAS, // You may calculate or pass a value for service charge
    request_date: selectedDate
      ? selectedDate.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0], // Format the date to YYYY-MM-DD
    email: formData.email,
    phone: formData.phone,
    name: formData.name,
    surname: formData.surname || "", // Handle optional fields
    art_catalog_link: formData.catalogLink || "", // Handle optional fields
    art_image: formData.artImage, // Assuming 'formData.image' holds the image URL or file path
    art_dimension: formData.dimensions || "", // Optional field
    art_medium: formData.medium || "", // Optional field
    is_art_mounted: formData.mounted ? 1 : 0, // Convert to 1 or 0 based on boolean mounted field
    request_status: 0, // Default to Pending (0), or handle based on your logic
    location_name: selectedLocation ? selectedLocation.location : "", // Assuming selectedLocation has a 'name'
    venue_name: selectedStaff ? selectedStaff.venue_name : "", // Assuming selectedLocation has a 'name'
    slot_name: selectedSlot ? selectedSlot.slot_name : "", // Assuming selectedLocation has a 'name'
    slot_price: selectedSlot ? selectedSlot.slot_price : 0, // Assuming selectedLocation has a 'name'
    user_id: loggedInUser.id, // Assuming selectedLocation has a 'name'
  };
};
export const getSlotHeadersForAdmin = () => {
  const headersString = `
    DATE
    VENUE NAME
    LOCATION
    PAINTING SLOT
    PRICE
    HANDLING
    TOTAL
    EMAIL
    PHONE
    NAME
    SURNAME
    STATUS
    ACTIONS
    ART IMAGE
    SLOT DIMENSIONS
    MOUNTED

    `;

  // Split the string by new lines and trim extra spaces
  const headersArray = headersString
    .split("\n")
    .map((header) => header.trim())
    .filter((header) => header !== "");

  return headersArray;
};
export const getVenueHeadersForAdmin = () => {
  return [
    "Venue ID",
    "Venue Name",
    "Website",
    "Established Date",
    "Company Name",
    "Company Type",
    "Venue Description",
    "Venue Onboarding Date",
    "Venue Location",
    "Venue Type",
    "Status",
    "Actions",
  ];
};

export const getArtsHeadersForAdmin = () => {
  return [
    "Title",
    "Category",
    "Country of Artist",
    "Price",
    "Discounted Price",
    "File",
    "Cover Image",
    "Artist Info",
    "Art Description",
    "Tags",
    "Uploaded On",
    "Art Status",
    "Actions",
  ];
};
export const getCurrencySymbolByCountry = (countryName) => {
  if (typeof countryName === "string") {
    countryName = countryName.toLowerCase();
  }

  const countryCurrencyMap = {
    usa: "$",
    "united kingdom": "£",
    "european union": "€",
    japan: "¥",
    india: "₹",
    canada: "C$",
    australia: "A$",
    china: "¥",
    switzerland: "CHF",
    russia: "₽",
    "south korea": "₩",
    brazil: "R$",
    "south africa": "R",
    mexico: "MX$",
    "saudi arabia": "﷼",
  };

  return countryCurrencyMap[countryName] || "Unknown Currency";
};

export const createPayloadSchema = (
  artId,
  artDetails,
  venueDetails,
  slotDetails
) => {
  return {
    artId: artId || null, // Unique identifier for the art
    artDetails: artDetails || null, // Object containing details about the art
    venueDetails: venueDetails || null, // Object containing details about the venue
    slotDetails: slotDetails || null, // Object containing details about the slot
  };
};

export const mapRoutePayloadToSlotRequest = (routePayload, userId) => {
  const { artDetails, venueDetails, slotDetails } = routePayload;

  return {
    venue_id: venueDetails?.venue_id,
    slot_id: slotDetails?.id,
    service_charge: import.meta.env.VITE_SERVICE_EXTRAS,
    request_date: new Date().toISOString().split("T")[0],
    request_status: 0,
    user_id: userId,
    art_id: artDetails?.id,
  };
};

export const mapUpdatedProfileDataToDto = (
  formData,
  bgImg,
  profileImg,
  userId
) => {
  return {
    phone: formData.phone,
    linkedin: formData.linkedin,
    instagram: formData.instagram,
    pinterest: formData.pinterest,
    profile_img: profileImg,
    background_img: bgImg,
    user_id: userId,
  };
};

export const FILTER_OPTIONS = ["All", "Pending", "Live"];

const countryCache = new Map();

export const getCountryNameByUserId = async (userId) => {
  if (countryCache.has(userId)) {
    return countryCache.get(userId);
  }

  try {
    const res = await getUserDataByUserId(userId);
    const country = res.country || "";
    countryCache.set(userId, country);
    return country;
  } catch (ex) {
    return "";
  }
};

export const getDateInFormat = (date) => {
  return format(new Date(date), "yyyy-MM-dd HH:mm:ss");
};

export const addTwentyPercentInArtPriceForUser = (price) => {
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    return "N/A";
  }
  return numericPrice + numericPrice * 0.2;
};

// utils/currencyConverter.js
export const convertCurrency = async (
  amount,
  baseCurrency,
  targetCurrency,
  baseCurrencySymbol,
  targetCurrencySymbol,
  forUser
) => {
  try {
    console.log(
      "currency",
      amount,
      baseCurrency,
      targetCurrency,
      baseCurrencySymbol,
      targetCurrencySymbol,
      forUser
    );

    if (forUser) {
      amount = addTwentyPercentInArtPriceForUser(amount);
    }
    if (baseCurrency == targetCurrency)
      return targetCurrencySymbol + " " + amount;

    const response = await fetch(
      `${
        import.meta.env.VITE_CURRENCY__EXCHANGE_URL
      }?amount=${amount}&from=${baseCurrency}&to=${targetCurrency}`
    );

    if (!response.ok) {
      return baseCurrencySymbol + " " + amount;
    }

    const data = await response.json();

    return targetCurrencySymbol + " " + data.rates[targetCurrency];
  } catch (error) {
    console.error("Currency conversion error:", error);
    return baseCurrencySymbol + " " + amount;
  }
};

/**
 *
 * @param {Object} config
 * @param {string} config.title - Notification Title
 * @param {string} config.message - Notification Message
 * @param {string} config.type - 'success' | 'danger' | 'info' | 'warning' | 'default'
 * @param {number} config.duration - Time in ms (default 3000ms)
 */
export const showNotification = ({
  title,
  message,
  type = "default",
  duration = 3000,
}) => {
  Store.addNotification({
    title,
    message,
    type, // success, danger, info, warning
    insert: "top",
    container: "top-center", // ✅ center at top
    animationIn: ["animate__animated", "animate__fadeInDown"], // ✅ nice slide from top down
    animationOut: ["animate__animated", "animate__fadeOutUp"], // ✅ slide up on close
    dismiss: {
      duration,
      onScreen: true,
      pauseOnHover: true,
    },
  });
};

export const getSelectedCountry = () => {
  const dropdownCountry = localStorage.getItem("selectedCountry");
  if (dropdownCountry && dropdownCountry.trim() !== "") {
    return dropdownCountry;
  }

  const user = localStorage.getItem("user");
  if (user) {
    try {
      const parsed = JSON.parse(user);
      return parsed?.country || "";
    } catch (e) {
      return "";
    }
  }

  return "";
};
