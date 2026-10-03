import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── TRIPS ────────────────────────────────────────────────────────────────────

export const getTrips = async () => {
  const snap = await getDocs(
    query(collection(db, "trips"), orderBy("date", "asc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getTripById = async (id) => {
  const snap = await getDoc(doc(db, "trips", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

export const addTrip = async (data) => {
  return await addDoc(collection(db, "trips"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const updateTrip = async (id, data) => {
  return await updateDoc(doc(db, "trips", id), data);
};

export const deleteTrip = async (id) => {
  return await deleteDoc(doc(db, "trips", id));
};

// ─── GALLERY ──────────────────────────────────────────────────────────────────

export const getGallery = async () => {
  const snap = await getDocs(
    query(collection(db, "gallery"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Only featured photos for home page, sorted by featuredOrder
export const getFeaturedGallery = async () => {
  const snap = await getDocs(
    query(
      collection(db, "gallery"),
      where("featured", "==", true),
      orderBy("featuredOrder", "asc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addGalleryItem = async (data) => {
  return await addDoc(collection(db, "gallery"), {
    ...data,
    featured: false,
    featuredOrder: 999,
    createdAt: serverTimestamp(),
  });
};

export const updateGalleryItem = async (id, data) => {
  return await updateDoc(doc(db, "gallery", id), data);
};

export const deleteGalleryItem = async (id) => {
  return await deleteDoc(doc(db, "gallery", id));
};

// ─── TEAM ─────────────────────────────────────────────────────────────────────

export const getTeam = async () => {
  const snap = await getDocs(
    query(collection(db, "team"), orderBy("order", "asc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addTeamMember = async (data) => {
  return await addDoc(collection(db, "team"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const updateTeamMember = async (id, data) => {
  return await updateDoc(doc(db, "team", id), data);
};

export const deleteTeamMember = async (id) => {
  return await deleteDoc(doc(db, "team", id));
};

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

export const getTestimonials = async () => {
  const snap = await getDocs(
    query(collection(db, "testimonials"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addTestimonial = async (data) => {
  return await addDoc(collection(db, "testimonials"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const deleteTestimonial = async (id) => {
  return await deleteDoc(doc(db, "testimonials", id));
};

// ─── LEADS ────────────────────────────────────────────────────────────────────

export const submitLead = async (data) => {
  // Check for duplicate phone per trip
  const existing = await getDocs(
    query(
      collection(db, "leads"),
      where("phone", "==", data.phone),
      where("tripId", "==", data.tripId)
    )
  );
  if (!existing.empty) {
    throw new Error("DUPLICATE");
  }
  return await addDoc(collection(db, "leads"), {
    ...data,
    contacted: false,
    createdAt: serverTimestamp(),
  });
};

export const getLeads = async () => {
  const snap = await getDocs(
    query(collection(db, "leads"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateLead = async (id, data) => {
  return await updateDoc(doc(db, "leads", id), data);
};

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

export const getSettings = async () => {
  const snap = await getDoc(doc(db, "settings", "main"));
  if (!snap.exists()) return {};
  return snap.data();
};

export const updateSettings = async (data) => {
  return await updateDoc(doc(db, "settings", "main"), data);
};
