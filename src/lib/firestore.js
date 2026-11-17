import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── TRIPS ────────────────────────────────────────────────────────────────────

export const getTrips = async () => {
  if (!db) return [];
  try {
    const snap = await getDocs(
      query(collection(db, "trips"), orderBy("date", "asc"))
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn("getTrips fallback:", err);
    return [];
  }
};

export const getTripById = async (id) => {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, "trips", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.warn("getTripById fallback:", err);
    return null;
  }
};

export const addTrip = async (data) => {
  if (!db) throw new Error("Database not connected");
  return await addDoc(collection(db, "trips"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const updateTrip = async (id, data) => {
  if (!db) throw new Error("Database not connected");
  return await updateDoc(doc(db, "trips", id), data);
};

export const deleteTrip = async (id) => {
  if (!db) throw new Error("Database not connected");
  return await deleteDoc(doc(db, "trips", id));
};

// ─── GALLERY ──────────────────────────────────────────────────────────────────

export const getGallery = async () => {
  if (!db) return [];
  try {
    const snap = await getDocs(
      query(collection(db, "gallery"), orderBy("createdAt", "desc"))
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    try {
      const snap = await getDocs(collection(db, "gallery"));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {
      return [];
    }
  }
};

// Only featured photos for home page, sorted by featuredOrder or slot
export const getFeaturedGallery = async () => {
  if (!db) return [];
  try {
    const snap = await getDocs(
      query(
        collection(db, "gallery"),
        where("featured", "==", true),
        orderBy("featuredOrder", "asc")
      )
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    try {
      const snap = await getDocs(collection(db, "gallery"));
      return snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((p) => p.featured)
        .sort((a, b) => (a.featuredOrder || a.slot || 99) - (b.featuredOrder || b.slot || 99));
    } catch (e) {
      return [];
    }
  }
};

export const setHomeSlotPhoto = async (slotNumber, data) => {
  if (!db) throw new Error("Database not connected");
  const slotDocId = `slot_${slotNumber}`;
  return await setDoc(
    doc(db, "gallery", slotDocId),
    {
      ...data,
      slot: slotNumber,
      featured: true,
      featuredOrder: slotNumber,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const clearHomeSlotPhoto = async (slotNumber) => {
  if (!db) throw new Error("Database not connected");
  const slotDocId = `slot_${slotNumber}`;
  return await setDoc(
    doc(db, "gallery", slotDocId),
    {
      featured: false,
      url: "",
      tripName: "",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const addGalleryItem = async (data) => {
  if (!db) throw new Error("Database not connected");
  return await addDoc(collection(db, "gallery"), {
    ...data,
    featured: false,
    featuredOrder: 999,
    createdAt: serverTimestamp(),
  });
};

export const updateGalleryItem = async (id, data) => {
  if (!db) throw new Error("Database not connected");
  return await updateDoc(doc(db, "gallery", id), data);
};

export const deleteGalleryItem = async (id) => {
  if (!db) throw new Error("Database not connected");
  return await deleteDoc(doc(db, "gallery", id));
};

// ─── TEAM ─────────────────────────────────────────────────────────────────────

export const getTeam = async () => {
  if (!db) return [];
  try {
    const snap = await getDocs(
      query(collection(db, "team"), orderBy("order", "asc"))
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    return [];
  }
};

export const addTeamMember = async (data) => {
  if (!db) throw new Error("Database not connected");
  return await addDoc(collection(db, "team"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const updateTeamMember = async (id, data) => {
  if (!db) throw new Error("Database not connected");
  return await updateDoc(doc(db, "team", id), data);
};

export const deleteTeamMember = async (id) => {
  if (!db) throw new Error("Database not connected");
  return await deleteDoc(doc(db, "team", id));
};

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

export const getTestimonials = async () => {
  if (!db) return [];
  try {
    const snap = await getDocs(
      query(collection(db, "testimonials"), orderBy("createdAt", "desc"))
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    return [];
  }
};

export const addTestimonial = async (data) => {
  if (!db) throw new Error("Database not connected");
  return await addDoc(collection(db, "testimonials"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const deleteTestimonial = async (id) => {
  if (!db) throw new Error("Database not connected");
  return await deleteDoc(doc(db, "testimonials", id));
};

// ─── LEADS ────────────────────────────────────────────────────────────────────

export const submitLead = async (data) => {
  if (!db) {
    console.info("Firestore not connected, lead recorded locally:", data);
    return { id: `local_${Date.now()}` };
  }
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
  if (!db) return [];
  try {
    const snap = await getDocs(
      query(collection(db, "leads"), orderBy("createdAt", "desc"))
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    return [];
  }
};

export const updateLead = async (id, data) => {
  if (!db) throw new Error("Database not connected");
  return await updateDoc(doc(db, "leads", id), data);
};

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

export const getSettings = async () => {
  if (!db) return {};
  try {
    const snap = await getDoc(doc(db, "settings", "main"));
    if (!snap.exists()) return {};
    return snap.data();
  } catch (err) {
    return {};
  }
};

export const updateSettings = async (data) => {
  if (!db) throw new Error("Database not connected");
  return await updateDoc(doc(db, "settings", "main"), data);
};
