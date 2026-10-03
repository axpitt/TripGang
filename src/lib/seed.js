/**
 * TripGang — Firestore Seed Script
 * Run once via: node src/lib/seed.js (after build, or adapt for browser console)
 *
 * Since this runs in browser context, call window.seedFirestore() from the
 * browser console on the running dev server once.
 */

import { db } from "./firebase";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export const seedFirestore = async () => {
  console.log("🌱 Seeding Firestore...");

  // ─── SETTINGS ──────────────────────────────────────────────────────────────
  await setDoc(doc(db, "settings", "main"), {
    siteName: "TripGang",
    tagline: "Explore. Experience. Evolve.",
    whatsapp: "917038276535",
    instagram: "@tripgang.co",
    email: "tripgangofficial@gmail.com",
    city: "Chhatrapati Sambhajinagar, Maharashtra",
    floatingWhatsapp: true,
  });
  console.log("✅ Settings seeded");

  // ─── TEAM ──────────────────────────────────────────────────────────────────
  const team = [
    {
      name: "Arpit Japulkar",
      role: "Founder & Trip Organizer",
      phone: "7038276535",
      order: 1,
      photo: "",
    },
    {
      name: "Bablu Ade",
      role: "Co-Organizer",
      phone: "9022397476",
      order: 2,
      photo: "",
    },
    {
      name: "Samiksha More",
      role: "Female Coordinator",
      phone: "",
      order: 3,
      photo: "",
    },
    {
      name: "Prathmesh Kadam",
      role: "Social Media Manager",
      phone: "",
      order: 4,
      photo: "",
    },
  ];

  for (const member of team) {
    await addDoc(collection(db, "team"), {
      ...member,
      createdAt: serverTimestamp(),
    });
  }
  console.log("✅ Team seeded");

  // ─── FIRST TRIP ────────────────────────────────────────────────────────────
  const tripDate = Timestamp.fromDate(new Date("2026-07-01T06:00:00+05:30"));
  const earlyBirdDeadline = Timestamp.fromDate(
    new Date("2026-06-20T23:59:59+05:30")
  );

  await addDoc(collection(db, "trips"), {
    name: "Adrai Jungle Monsoon Trek 2026",
    subtitle: "Walk Through Clouds, Waterfalls & Untouched Rainforest",
    destination: "Adrai, Sahyadri",
    date: tripDate,
    earlyBirdPrice: 1499,
    regularPrice: 1599,
    earlyBirdDeadline: earlyBirdDeadline,
    maxSeats: 25,
    seatsBooked: 0,
    difficulty: "Easy",
    distance: "8-12 km",
    duration: "5-6 hours",
    type: "Day Trek",
    description:
      "Experience the raw beauty of Sahyadri during monsoon season. Walk through dense jungle trails, cross flowing streams, and witness breathtaking waterfalls on this guided day trek from Chhatrapati Sambhajinagar.",
    highlights: [
      "Dense jungle monsoon trail",
      "Natural waterfalls",
      "Professional photography",
      "Local guide with forest expertise",
      "Breakfast + Veg Lunch included",
    ],
    inclusions: [
      "Pickup & Drop — MIT Gate No. 1, Chhatrapati Sambhajinagar",
      "Breakfast + Fresh Veg Lunch",
      "Forest Entry Fees",
      "Professional Trek Coordination",
      "Local Guide",
      "First Aid Kit",
      "Photography",
      "Safety Equipment",
    ],
    exclusions: [
      "Personal expenses",
      "Any food outside the provided meals",
      "Travel insurance",
    ],
    itinerary: [
      { time: "5:30 AM", activity: "Assembly at MIT Gate No. 1" },
      { time: "6:00 AM", activity: "Departure by vehicle" },
      { time: "8:00 AM", activity: "Arrival at Adrai base + Breakfast" },
      { time: "8:30 AM", activity: "Trek briefing + Safety instructions" },
      { time: "9:00 AM", activity: "Trek begins into jungle trail" },
      { time: "11:00 AM", activity: "Waterfall point — exploration & photography" },
      { time: "1:00 PM", activity: "Summit / scenic viewpoint lunch" },
      { time: "2:30 PM", activity: "Return trek descent" },
      { time: "4:00 PM", activity: "Base camp — rest & debrief" },
      { time: "4:30 PM", activity: "Return journey to Sambhajinagar" },
      { time: "6:30 PM", activity: "Arrival & disperse at MIT Gate No. 1" },
    ],
    packingList: {
      mustCarry: [
        "ID proof (Aadhar/PAN)",
        "Water bottle (minimum 2L)",
        "Trekking shoes or sports shoes (NO sandals/slippers)",
        "Rain poncho / raincoat",
        "Personal medicines",
        "Small backpack",
        "Dry snacks (biscuits/nuts)",
        "Power bank",
        "Extra set of clothes (in waterproof bag)",
      ],
      recommended: [
        "Trekking pole",
        "Sun cap / hat",
        "Sunscreen",
        "Mosquito repellent",
        "Camera",
        "Waterproof bag/cover for phone",
      ],
      prohibited: [
        "Alcohol or tobacco",
        "Plastic bags",
        "Loud music speakers",
        "Any fire-related items",
        "Pets",
      ],
    },
    coordinators: [
      { name: "Arpit Japulkar", phone: "7038276535" },
      { name: "Bablu Ade", phone: "9022397476" },
    ],
    heroImage: "",
    gallery: [],
    status: "active",
    isFeatured: true,
    createdAt: serverTimestamp(),
  });
  console.log("✅ First trip seeded: Adrai Jungle Monsoon Trek 2026");

  console.log("🎉 All done! Firestore is ready.");
  return "Seed complete";
};

// Expose to browser console for one-time seeding
if (typeof window !== "undefined") {
  window.seedFirestore = seedFirestore;
}
