// ModalWithCards.jsx
import React, { useEffect,useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {fetchArtsByUserId}  from "../services/ApiService";; // Adjust the import path as necessary
import { useNavigate} from "react-router-dom";
import {createPayloadSchema , getCountryNameByUserId , getCurrencySymbolByCountry} from "../utilities/Utility";
const cards = [
  { title: 'Card One', description: 'This is card one.' },
  { title: 'Card Two', description: 'This is card two.' },
  { title: 'Card Three', description: 'This is card three.' },
  { title: 'Card Four', description: 'This is card four.' },
];

export default function ArtsModal({ isOpen, onClose,routedPayload }) {
const navigate = useNavigate();
      const [userCountries, setUserCountries] = useState({});
    
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [artWorks,setArtworks] = useState([]);

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setLoggedInUser(user); 

      fetchArtsByUserId(user.id).then((data) => {
        if(routedPayload?.artId == null){
            const availableArtworks = data.filter(item => item?.art_status != 3);
            setArtworks(availableArtworks);
        }else{
            data.forEach((art) => {
                if(art.id == routedPayload.artId){
                    setArtworks([art]);
                }
            });
        }
    }).catch((error) => {
        console.error("Error fetching arts:", error);
    });
    }
    
  },[routedPayload]);
   useEffect(() => {
       const fetchAllCountries = async () => {
         const countryMap = { ...userCountries };
   
         await Promise.all(
            artWorks.map(async (art) => {
             const userId = art.user_id;
             if (userId && !countryMap[userId]) {
               const country = await getCountryNameByUserId(userId);
               countryMap[userId] = country;
             }
           })
         );
   
         setUserCountries(countryMap);
       };
   
       if (artWorks?.length > 0) {
         fetchAllCountries();
       }
     }, [artWorks]);
const handleArtClick = (art) => {
    routedPayload = createPayloadSchema(routedPayload?.artId,art,routedPayload?.venueDetails, routedPayload?.slotDetails);
            
    navigate(`/buy-artwork/${art.id}`,{ state: { routedPayload:routedPayload } });
};
return (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800">Select Your Artwork</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-800 transition"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {artWorks.map((art) => (
                            <div
                                key={art.id}
                                className="bg-[#FAF3DD] hover:bg-[#f9f5e9] transition p-4 rounded-xl shadow-sm"
                            >
                                <img
                                    src={art.cover_img}
                                    alt={art.title}
                                    className="w-full h-40 object-cover rounded-lg mb-3"
                                />
                                <h3 className="text-lg font-medium text-gray-700 text-center">{art.title}</h3>
                                <p className="text-sm text-gray-500 mt-1 text-center">Price: {getCurrencySymbolByCountry(userCountries[art.user_id])} {art.discounted_price}</p>
                                <button
                                    onClick={() => handleArtClick(art)}
                                    className="bg-black text-white py-2 px-4 rounded-lg mt-3 w-full transition"
                                >
                                    Continue
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);
}
