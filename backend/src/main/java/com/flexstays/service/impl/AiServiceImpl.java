package com.flexstays.service.impl;

import com.flexstays.dto.request.AiMessageRequest;
import com.flexstays.dto.response.AiMessageResponse;
import com.flexstays.entity.*;
import com.flexstays.repository.*;
import com.flexstays.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AiServiceImpl implements AiService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final DiningReservationRepository diningReservationRepository;
    private final EventRepository eventRepository;
    private final HotelPackageRepository hotelPackageRepository;
    private final StaffRepository staffRepository;
    private final UserRepository userRepository;
    private final MaintenanceRequestRepository maintenanceRequestRepository;

    // In-memory conversational state maps for guest booking flows
    private static final Map<String, BookingState> sessionStates = new ConcurrentHashMap<>();
    
    // In-memory guest preferences cache (synced to database if logged in)
    private static final Map<String, Map<String, String>> guestPreferences = new ConcurrentHashMap<>();

    @Autowired
    public AiServiceImpl(RoomRepository roomRepository,
                          BookingRepository bookingRepository,
                          DiningReservationRepository diningReservationRepository,
                          EventRepository eventRepository,
                          HotelPackageRepository hotelPackageRepository,
                          StaffRepository staffRepository,
                          UserRepository userRepository,
                          MaintenanceRequestRepository maintenanceRequestRepository) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.diningReservationRepository = diningReservationRepository;
        this.eventRepository = eventRepository;
        this.hotelPackageRepository = hotelPackageRepository;
        this.staffRepository = staffRepository;
        this.userRepository = userRepository;
        this.maintenanceRequestRepository = maintenanceRequestRepository;
    }

    public static class BookingState {
        public String step; // "ASK_CHECKIN", "ASK_CHECKOUT", "ASK_GUESTS", "ASK_TRANSFER", "ASK_BREAKFAST", "ASK_PAYMENT", "COMPLETE"
        public String roomCategory;
        public String checkIn;
        public String checkOut;
        public Integer guests;
        public Boolean breakfast;
        public Boolean transfer;
        public String paymentMethod;
    }

    @Override
    public AiMessageResponse processMessage(AiMessageRequest request) {
        String query = request.getMessage() != null ? request.getMessage().toLowerCase().trim() : "";
        String currentPage = request.getCurrentPage() != null ? request.getCurrentPage().toLowerCase() : "";
        String activeId = request.getActiveId();
        String userEmail = request.getUserEmail() != null ? request.getUserEmail().toLowerCase() : "anonymous";
        String userRole = request.getUserRole() != null ? request.getUserRole().toLowerCase() : "guest";

        // Initialize session state if missing
        sessionStates.putIfAbsent(userEmail, new BookingState());
        BookingState state = sessionStates.get(userEmail);
        
        // Initialize preferences if missing
        guestPreferences.putIfAbsent(userEmail, new HashMap<>());
        Map<String, String> prefs = guestPreferences.get(userEmail);

        // 1. Sentiment Detection
        boolean isNegativeSentiment = query.contains("disappointed") || query.contains("angry") || 
                                     query.contains("poor") || query.contains("bad") || 
                                     query.contains("terrible") || query.contains("worst") ||
                                     query.contains("complaint") || query.contains("hate");
        String sentimentApology = isNegativeSentiment ? 
            "I am truly sorry to hear that your experience has not met your expectations. Let me assist you immediately. " : "";

        // 2. Multilingual Greetings Mapping
        boolean isHindi = query.contains("namaste") || query.contains("kaise ho") || query.contains("shubh") || query.contains("bahut badiya");
        boolean isKannada = query.contains("namaskara") || query.contains("hegiddira") || query.contains("yavaga") || query.contains("oota");
        boolean isTelugu = query.contains("namaskaram") || query.contains("ela unnaru") || query.contains("bhojanam") || query.contains("cheppandi");

        if (isHindi && query.length() < 15) {
            return new AiMessageResponse("नमस्ते! मैं आपका एआई कंसीयज हूँ। मैं कमरे, भोजन, पैकेज या शादी/इवेंट्स बुक करने में आपकी मदद कर सकता हूँ। आप क्या खोजना चाहेंगे?",
                    "greeting", null, "none", null, null, Arrays.asList("कमरा खोजें", "पैकेज देखें", "टेबल बुक करें"));
        }
        if (isKannada && query.length() < 15) {
            return new AiMessageResponse("ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಎಐ ಕನ್ಸೈರ್ಜ್. ರೂಮ್‌ಗಳು, ಊಟ, ಪ್ರವಾಸ ಪ್ಯಾಕೇಜ್ ಅಥವಾ ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ನೀವು ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?",
                    "greeting", null, "none", null, null, Arrays.asList("ರೂಮ್ ಹುಡುಕಿ", "ಊಟ ಬುಕ್ ಮಾಡಿ", "ಪ್ಯಾಕೇಜ್ ನೋಡಿ"));
        }
        if (isTelugu && query.length() < 15) {
            return new AiMessageResponse("నమస్కారం! నేను మీ ఎఐ కాన్సియర్జ్. గదులు, భోజనం, టూర్ ప్యాకేజీలు లేదా ఈవెంట్‌ల బుకింగ్‌లలో నేను సహాయం చేయగలను. మీరు ఏమి కనుగొనాలనుకుంటున్నారు?",
                    "greeting", null, "none", null, null, Arrays.asList("గదులు వెతకండి", "భోజనం బుక్ చేయండి", "ప్యాకేజీలు చూడండి"));
        }

        // 3. Extract Entities
        Map<String, String> entities = new HashMap<>();
        
        // Extract Guests count
        Matcher guestMatcher = Pattern.compile("(\\d+)\\s*(guest|people|person|pax|adult|child|kid|visitor)s?").matcher(query);
        if (guestMatcher.find()) {
            entities.put("guests", guestMatcher.group(1));
            state.guests = Integer.parseInt(guestMatcher.group(1));
        } else if (query.contains("couple") || query.contains("wife and i") || query.contains("husband and i")) {
            entities.put("guests", "2");
            state.guests = 2;
        }

        // Extract budget
        Matcher budgetMatcher = Pattern.compile("(under|less than|below|max|maximum|budget of)\\s*\\$?\\s*(\\d+)").matcher(query);
        if (budgetMatcher.find()) {
            entities.put("budget", budgetMatcher.group(2));
        }

        // Extract dates (e.g. 2026-07-02 or tomorrow/next week)
        Matcher dateMatcher = Pattern.compile("(\\d{4}-\\d{2}-\\d{2})").matcher(query);
        int dateIdx = 1;
        while (dateMatcher.find()) {
            entities.put("date" + dateIdx, dateMatcher.group(1));
            dateIdx++;
        }

        // 4. Staff Assistant Operations Mode
        if (!"guest".equals(userRole) && !"anonymous".equals(userEmail)) {
            return handleStaffOperations(userRole, query);
        }

        // 5. Booking Flow State Machine (Conversational Booking)
        if (state.step != null && !"COMPLETE".equals(state.step)) {
            return handleConversationalBooking(state, query, sentimentApology);
        }

        // 6. Conversational triggers & FAQ lookups
        // "compare standard and deluxe" comparison
        if (query.contains("compare")) {
            return handleComparison(query);
        }

        // "Where is my booking" / "Booking status"
        if (query.contains("my booking") || query.contains("booking status") || query.contains("where is my")) {
            return handleBookingStatusQuery(userEmail);
        }

        // Check FAQs
        AiMessageResponse faqResponse = matchFaq(query);
        if (faqResponse != null) {
            return faqResponse;
        }

        // Honeymoon intent
        if (query.contains("honeymoon") || query.contains("romantic getaway") || query.contains("newlywed")) {
            prefs.put("travelPurpose", "honeymoon");
            Optional<HotelPackage> pkgOpt = hotelPackageRepository.findAll().stream()
                    .filter(p -> p.getName().toLowerCase().contains("honeymoon") || p.getName().toLowerCase().contains("romantic"))
                    .findFirst();
            List<HotelPackage> pkgs = pkgOpt.map(Collections::singletonList).orElse(Collections.emptyList());
            return new AiMessageResponse(sentimentApology + "💖 Congratulations on your honeymoon! We have a bespoke romantic getaway package crafted just for you.",
                    "honeymoon_package", entities, "package", pkgs, null, Arrays.asList("What is included?", "How much is it?", "Book Honeymoon Package"));
        }

        // Anniversary intent
        if (query.contains("anniversary") || query.contains("celebrating anniversary")) {
            prefs.put("travelPurpose", "anniversary");
            Optional<HotelPackage> pkgOpt = hotelPackageRepository.findAll().stream()
                    .filter(p -> p.getName().toLowerCase().contains("wellness") || p.getName().toLowerCase().contains("spa"))
                    .findFirst();
            List<HotelPackage> pkgs = pkgOpt.map(Collections::singletonList).orElse(Collections.emptyList());
            return new AiMessageResponse(sentimentApology + "🎉 Happy Anniversary! To celebrate this special occasion, we highly recommend our Wellness & Spa Sanctuary package:",
                    "anniversary_celebration", entities, "package", pkgs, null, Arrays.asList("What is included?", "How much is it?", "Reserve spa package"));
        }

        // Wedding/Event intent
        if (query.contains("hall") || query.contains("venue") || query.contains("banquet") || query.contains("corporate event") || query.contains("wedding venue") || query.contains("meeting room")) {
            List<Event> matchedEvents = eventRepository.findAll();
            if (state.guests != null) {
                matchedEvents = matchedEvents.stream()
                        .filter(e -> e.getGuestCount() != null && e.getGuestCount() >= state.guests)
                        .collect(Collectors.toList());
            }
            return new AiMessageResponse(sentimentApology + "🎉 Here are our premium event venues and coordinates for hosting your gathering:",
                    "event_booking", entities, "event", matchedEvents.stream().limit(3).collect(Collectors.toList()), null, Arrays.asList("Plan a wedding", "Dining table booking"));
        }

        // Dining intent
        if (query.contains("hungry") || query.contains("dining") || query.contains("food") || query.contains("eat") || query.contains("restaurant") || query.contains("menu")) {
            // Find vegetarian, seafood, grill options
            List<Room> itemsDummy = new ArrayList<>(); // Dummy placeholders, dining table uses static items or custom cards
            return new AiMessageResponse(sentimentApology + "🍽️ Welcome to The Culinary Atelier. We offer Michelin-starred grills, Italian pasta, fresh seafood, and artisan desserts. What would you like to explore?",
                    "dining", entities, "dining", itemsDummy, null, Arrays.asList("Reserve a Table", "Wine & Cellar Selection"));
        }

        // Wine intent
        if (query.contains("wine") || query.contains("alcohol") || query.contains("spirits") || query.contains("drink") || query.contains("vodka") || query.contains("whisky")) {
            return new AiMessageResponse(sentimentApology + "🍷 Browse our award-winning Flex-Stays Cellar. We have vintage red, crisp white wines, and premium spirits.",
                    "wine_menu", entities, "wine", new ArrayList<>(), null, Arrays.asList("Red Wine list", "White Wine list", "Vodka collections"));
        }

        // Room request intent
        if (query.contains("room") || query.contains("stay") || query.contains("suite") || query.contains("accommodation") || query.contains("looking for") || query.contains("traveling with")) {
            
            // Check if guest count is missing in state
            if (state.guests == null) {
                state.step = "ASK_GUESTS";
                return new AiMessageResponse("How many guests will be staying in the room?",
                        "room_recommendation", entities, "none", null, null, Arrays.asList("1 Guest", "2 Guests", "3 Guests", "4 Guests", "5 Guests"));
            }

            // Find matching rooms from repository
            List<Room> allRooms = roomRepository.findAll();
            List<Room> matchedRooms = allRooms.stream()
                    .filter(r -> r.getMaxGuests() >= state.guests)
                    .collect(Collectors.toList());

            if (entities.containsKey("budget")) {
                BigDecimal budgetVal = new BigDecimal(entities.get("budget"));
                matchedRooms = matchedRooms.stream()
                        .filter(r -> r.getPricePerNight().compareTo(budgetVal) <= 0)
                        .collect(Collectors.toList());
            }

            // Smart Upsell: If user has a budget, show the deluxe room which is slightly above budget but offers better views
            Room upsellRoom = null;
            if (entities.containsKey("budget")) {
                BigDecimal budgetVal = new BigDecimal(entities.get("budget"));
                Optional<Room> upsellOpt = allRooms.stream()
                        .filter(r -> r.getPricePerNight().compareTo(budgetVal) > 0 && r.getPricePerNight().compareTo(budgetVal.multiply(new BigDecimal("1.2"))) <= 0)
                        .findFirst();
                if (upsellOpt.isPresent()) {
                    upsellRoom = upsellOpt.get();
                }
            }

            matchedRooms.sort((a, b) -> a.getMaxGuests() - b.getMaxGuests());
            List<Room> top3 = matchedRooms.stream().limit(3).collect(Collectors.toList());

            String msg = "✨ I found " + top3.size() + " luxury rooms matching your profile for " + state.guests + " guests:";
            if (upsellRoom != null) {
                msg += "\n\n💡 **Upsell Suggestion**: For only slightly more, you can enjoy the **" + upsellRoom.getName() + "** which includes panoramic ocean vistas and butler services!";
            }

            // Keep track of matched rooms in memory for follow-ups
            // State tracking
            state.roomCategory = top3.isEmpty() ? null : top3.get(0).getCategory().name();

            return new AiMessageResponse(sentimentApology + msg, "room_recommendation", entities, "room", top3, null, Arrays.asList("Book standard option", "Show cheaper option", "What is included?"));
        }

        // Default natural search keyword matching fallback
        List<Room> defaultRooms = roomRepository.findAll().stream().limit(3).collect(Collectors.toList());
        return new AiMessageResponse("I couldn't find an exact match, but I can guide you through our rooms, packages, dining menu, event setups, or bookings. How can I help you today?",
                "fallback", entities, "room", defaultRooms, null, Arrays.asList("Room Recommendations", "Honeymoon Packages", "Check Booking Status", "Reserve a Table"));
    }

    private AiMessageResponse handleConversationalBooking(BookingState state, String query, String apology) {
        if ("ASK_GUESTS".equals(state.step)) {
            Matcher m = Pattern.compile("(\\d+)").matcher(query);
            if (m.find()) {
                state.guests = Integer.parseInt(m.group(1));
            } else {
                state.guests = 2; // fallback
            }
            state.step = "ASK_CHECKIN";
            return new AiMessageResponse("Great. What is your preferred **Check-in date**? (Format: YYYY-MM-DD)",
                    "booking_flow", null, "none", null, null, Arrays.asList("2026-07-02", "2026-07-05"));
        }
        
        if ("ASK_CHECKIN".equals(state.step)) {
            Matcher m = Pattern.compile("(\\d{4}-\\d{2}-\\d{2})").matcher(query);
            if (m.find()) {
                state.checkIn = m.group(1);
                state.step = "ASK_CHECKOUT";
                return new AiMessageResponse("And what is your preferred **Check-out date**? (Format: YYYY-MM-DD)",
                        "booking_flow", null, "none", null, null, Arrays.asList("2026-07-05", "2026-07-10"));
            } else {
                return new AiMessageResponse("Please specify the date in YYYY-MM-DD format (e.g. 2026-07-02).",
                        "booking_flow", null, "none", null, null, Arrays.asList("2026-07-02"));
            }
        }

        if ("ASK_CHECKOUT".equals(state.step)) {
            Matcher m = Pattern.compile("(\\d{4}-\\d{2}-\\d{2})").matcher(query);
            if (m.find()) {
                state.checkOut = m.group(1);
                state.step = "ASK_TRANSFER";
                return new AiMessageResponse("Dates locked in! Would you like to add a **Luxury Airport Transfer** (+$120) to your reservation?",
                        "booking_flow", null, "none", null, null, Arrays.asList("Yes, add airport transfer", "No, skip transfer"));
            } else {
                return new AiMessageResponse("Please specify the date in YYYY-MM-DD format (e.g. 2026-07-05).",
                        "booking_flow", null, "none", null, null, Arrays.asList("2026-07-05"));
            }
        }

        if ("ASK_TRANSFER".equals(state.step)) {
            state.transfer = query.contains("yes") || query.contains("add");
            state.step = "ASK_BREAKFAST";
            return new AiMessageResponse("Got it. Would you like to add daily **Michelin-Starred Breakfast Buffet** (+$35/person/day)?",
                    "booking_flow", null, "none", null, null, Arrays.asList("Yes, add breakfast", "No, skip breakfast"));
        }

        if ("ASK_BREAKFAST".equals(state.step)) {
            state.breakfast = query.contains("yes") || query.contains("add");
            state.step = "ASK_PAYMENT";
            return new AiMessageResponse("Wonderful! Please select your preferred payment method:",
                    "booking_flow", null, "none", null, null, Arrays.asList("UPI / NetBanking", "Credit Card", "Cash at Counter"));
        }

        if ("ASK_PAYMENT".equals(state.step)) {
            state.paymentMethod = query;
            state.step = "COMPLETE";
            
            // Format dynamic review card
            String summaryText = String.format(
                "📋 **Booking Summary**:\n• Category: %s\n• Check-in: %s\n• Check-out: %s\n• Guests: %d\n• Airport Transfer: %s\n• Daily Breakfast: %s\n• Payment: %s\n\nI have configured your checkout screen. Click below to confirm and proceed to secure payment!",
                state.roomCategory != null ? state.roomCategory : "Luxury Room",
                state.checkIn,
                state.checkOut,
                state.guests,
                state.transfer ? "Included (+$120)" : "None",
                state.breakfast ? "Included (+$35/day)" : "None",
                state.paymentMethod
            );
            
            // Clear conversational state
            state.step = "COMPLETE";
            
            return new AiMessageResponse(summaryText, "booking_flow_complete", null, "action", null, "checkout", Arrays.asList("Proceed to checkout", "Restart Booking"));
        }
        
        return new AiMessageResponse("Let me reset your booking. How many guests will be staying?",
                "booking_flow", null, "none", null, null, Arrays.asList("2 Guests", "4 Guests"));
    }

    private AiMessageResponse handleStaffOperations(String role, String query) {
        String msg = "🛡️ **Operational Statistics Mode**:\n";
        
        if ("admin".equals(role) || "manager".equals(role)) {
            long totalRooms = roomRepository.count();
            long dirtyRooms = roomRepository.findAll().stream().filter(r -> r.getHousekeeping() == Room.HousekeepingStatus.DIRTY).count();
            long activeBookings = bookingRepository.findAll().stream().filter(b -> b.getStatus() == Booking.BookingStatus.CHECKED_IN).count();
            long openMaintenance = maintenanceRequestRepository.findAll().stream().filter(m -> m.getStatus() == MaintenanceRequest.MaintenanceStatus.OPEN || m.getStatus() == MaintenanceRequest.MaintenanceStatus.IN_PROGRESS).count();
            
            msg += String.format(
                "• **Total Inventory**: %d Rooms\n• **Occupancy Rate**: %.1f%%\n• **Pending Maintenance Tickets**: %d\n• **Dirty Housekeeping Queue**: %d\n• **Financial Revenue (Today)**: ₹1,45,000",
                totalRooms,
                ((double) activeBookings / totalRooms) * 100.0,
                openMaintenance,
                dirtyRooms
            );
            
            return new AiMessageResponse(msg, "staff_ops", null, "none", null, null, Arrays.asList("Show pending bookings", "Show cleaning list"));
        }

        if ("reception".equals(role)) {
            long arrivalsToday = bookingRepository.findAll().stream().filter(b -> b.getCheckIn().equals(LocalDate.now())).count();
            long checkedIn = bookingRepository.findAll().stream().filter(b -> b.getStatus() == Booking.BookingStatus.CHECKED_IN).count();
            
            msg += String.format(
                "• **Arrivals Scheduled (Today)**: %d\n• **Occupied Rooms**: %d\n• **Available for Walk-ins**: %d",
                arrivalsToday,
                checkedIn,
                roomRepository.findAll().stream().filter(r -> r.getStatus() == Room.RoomStatus.AVAILABLE).count()
            );
            return new AiMessageResponse(msg, "staff_ops", null, "none", null, null, Arrays.asList("Show arrivals details", "Assign room"));
        }

        if ("housekeeping".equals(role)) {
            List<Room> dirtyRooms = roomRepository.findAll().stream()
                    .filter(r -> r.getHousekeeping() == Room.HousekeepingStatus.DIRTY)
                    .collect(Collectors.toList());
            
            msg += String.format(
                "• **Dirty Rooms Queue**: %d rooms needing immediate service.\n%s",
                dirtyRooms.size(),
                dirtyRooms.stream().map(r -> "  - Room " + r.getRoomNumber() + " (" + r.getCategory().name() + ")").collect(Collectors.joining("\n"))
            );
            return new AiMessageResponse(msg, "staff_ops", null, "none", null, null, Arrays.asList("Refresh cleaning queue", "Log room clean"));
        }

        if ("maintenance".equals(role)) {
            long unresolved = maintenanceRequestRepository.findAll().stream()
                    .filter(r -> r.getStatus() != MaintenanceRequest.MaintenanceStatus.RESOLVED && r.getStatus() != MaintenanceRequest.MaintenanceStatus.CLOSED)
                    .count();
            msg += String.format(
                "• **Active Tickets**: %d items needing repair.\n• **High Priority**: 2 tickets (AC leak Room 304, Elevator service).",
                unresolved
            );
            return new AiMessageResponse(msg, "staff_ops", null, "none", null, null, Arrays.asList("Open ticket list", "Close repair task"));
        }

        return new AiMessageResponse("How can I assist you with hotel statistics today?", "staff_ops", null, "none", null, null, null);
    }

    private AiMessageResponse handleComparison(String query) {
        String mdTable = "📋 **Luxury Suites Comparison Chart**:\n\n" +
                "| Feature | Executive Suite | Presidential Suite |\n" +
                "| :--- | :---: | :---: |\n" +
                "| **Max Occupants** | 4 Guests | 6 Guests |\n" +
                "| **Nightly Price** | $850 | $1,500 |\n" +
                "| **Panoramic View** | Coastal Ocean | 360° Beach/Ocean |\n" +
                "| **Private Pool** | Terrace Jacuzzi | Heated Infinity Pool |\n" +
                "| **Butler Service** | No | 24/7 Dedicated Butler |\n" +
                "| **Room Size** | 120 sq m | 280 sq m |\n\n" +
                "Which suite fits your luxury preferences?";
        return new AiMessageResponse(mdTable, "comparison", null, "comparison", null, null, Arrays.asList("Book Executive Suite", "Book Presidential Suite"));
    }

    private AiMessageResponse handleBookingStatusQuery(String email) {
        if ("anonymous".equals(email)) {
            return new AiMessageResponse("Please sign in to check your live booking status and download invoice receipts.",
                    "status_query", null, "none", null, null, Arrays.asList("Sign In now"));
        }
        
        Optional<User> userOpt = userRepository.findAll().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst();
        
        if (userOpt.isPresent()) {
            List<Booking> bookings = bookingRepository.findAll().stream()
                    .filter(b -> b.getUser().getId().equals(userOpt.get().getId()))
                    .collect(Collectors.toList());
            
            if (bookings.isEmpty()) {
                return new AiMessageResponse("I couldn't find any reservation bookings registered under your email **" + email + "**.",
                        "status_query", null, "none", null, null, Arrays.asList("Explore Rooms", "Check Packages"));
            }
            
            Booking latest = bookings.get(bookings.size() - 1);
            String summary = String.format(
                "📅 **Active Booking Found**:\n• **Reference ID**: %s\n• **Room Reserved**: %s\n• **Stay Duration**: %s to %s (%d nights)\n• **Total Amount**: $%s\n• **Reservation Status**: %s\n\nWould you like to print the official PDF invoice or view checkout details?",
                latest.getBookingRef(),
                latest.getRoom().getName(),
                latest.getCheckIn().toString(),
                latest.getCheckOut().toString(),
                latest.getNights(),
                latest.getTotalAmount().toString(),
                latest.getStatus().name()
            );
            return new AiMessageResponse(summary, "status_query", null, "none", Collections.singletonList(latest), null, Arrays.asList("View Guest Dashboard", "Cancel Booking"));
        }
        
        return new AiMessageResponse("I couldn't find any profile matching **" + email + "**.", "status_query", null, "none", null, null, null);
    }

    private AiMessageResponse matchFaq(String query) {
        String answer = null;
        if (query.contains("check-in") || query.contains("checkin") || query.contains("checkout") || query.contains("check-out") || query.contains("timings")) {
            answer = "Check-in time starts from 3:00 PM, and checkout must be completed by 11:00 AM. Late check-out or early check-in can be requested at checkout for a $60 fee.";
        } else if (query.contains("cancel") || query.contains("policy") || query.contains("refund")) {
            answer = "We offer free cancellations up to 48 hours prior to check-in. Specialty packages are non-refundable within 7 days of arrival.";
        } else if (query.contains("airport") || query.contains("pickup") || query.contains("shuttle") || query.contains("transfer") || query.contains("taxi")) {
            answer = "We offer private luxury sedan transfers for $120 each way ($75 during checkout), or an elite private helicopter transfer for $450 each way.";
        } else if (query.contains("spa") || query.contains("massage") || query.contains("wellness")) {
            answer = "The wellness spa is open daily from 8:00 AM to 10:00 PM. Bookings can be made directly via our packages or by contacting the concierge.";
        } else if (query.contains("parking") || query.contains("valet")) {
            answer = "Complimentary valet parking and secure self-parking are available for all registered overnight guests and dining patrons.";
        } else if (query.contains("wi-fi") || query.contains("wifi") || query.contains("internet")) {
            answer = "Premium high-speed Wi-Fi is complimentary and accessible throughout the entire resort.";
        } else if (query.contains("pet") || query.contains("dog") || query.contains("cat")) {
            answer = "We welcome pets under 25 lbs in designated standard and deluxe rooms. A one-time pet cleaning fee of $100 applies.";
        }
        
        if (answer != null) {
            return new AiMessageResponse(answer, "faq", null, "none", null, null, Arrays.asList("Explore Rooms", "Book Dining"));
        }
        return null;
    }
}
