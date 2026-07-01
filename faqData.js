const faqData = [
    {
        keywords: ['check-in', 'checkin', 'checkout', 'check-out', 'time', 'timings'],
        question: "What are the check-in and check-out times?",
        answer: "Check-in begins at 3:00 PM, and check-out is by 11:00 AM. Early check-in or late check-out can be arranged during checkout for an additional fee."
    },
    {
        keywords: ['cancellation', 'cancel', 'refund', 'policy'],
        question: "What is your cancellation policy?",
        answer: "We offer free cancellation up to 48 hours prior to check-in. Within 48 hours, the first night stay will be charged. Specialty experience packages are non-refundable within 7 days of arrival."
    },
    {
        keywords: ['airport', 'pickup', 'transfer', 'shuttle', 'transport', 'taxi', 'helicopter'],
        question: "Do you offer airport transfer services?",
        answer: "Yes, we offer private luxury sedan transfers for $120 each way ($75 if added during booking checkout), or an elite private helicopter transfer for $450 each way."
    },
    {
        keywords: ['spa', 'wellness', 'massage', 'therapy'],
        question: "What are the spa timings?",
        answer: "The wellness spa is open daily from 8:00 AM to 10:00 PM. Bookings can be made directly via our wellness packages or by contacting the concierge."
    },
    {
        keywords: ['parking', 'car', 'valet'],
        question: "Is parking available at the resort?",
        answer: "We offer complimentary valet parking and secure self-parking for all registered overnight guests and dining patrons."
    },
    {
        keywords: ['wi-fi', 'wifi', 'internet'],
        question: "Is high-speed Wi-Fi available?",
        answer: "Complimentary premium high-speed Wi-Fi is available throughout the entire resort, including guest rooms, dining venues, and poolside areas."
    },
    {
        keywords: ['pet', 'pets', 'dog', 'cat', 'animal'],
        question: "What is the pet policy?",
        answer: "We are a pet-friendly resort! Dogs under 25 lbs are welcome in designated standard and deluxe rooms. A one-time pet cleaning fee of $100 applies."
    }
];

if (typeof window !== 'undefined') {
    window.faqData = faqData;
}
