"use client";

import { useEffect, useRef } from "react";
import { db } from "../config/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

/**
 * NotificationManager
 * 
 * Invisible component that:
 * 1. Requests browser notification permission on mount
 * 2. Listens to Firestore 'orders' and 'contacts' collections in real-time
 * 3. Detects NEW documents (skips initial load) and fires browser notifications
 * 4. Plays a subtle audio chime for immediate admin attention
 */
export default function NotificationManager() {
  // Track whether the initial Firestore snapshot has loaded (to avoid notifying on existing data)
  const ordersInitialLoad = useRef(true);
  const contactsInitialLoad = useRef(true);

  /**
   * Request browser notification permission on first mount.
   * This triggers the browser's native permission dialog.
   */
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  /**
   * Plays a short notification chime using the Web Audio API.
   * No external sound files needed — generates a clean sine wave tone.
   */
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // First tone
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
      oscillator.frequency.setValueAtTime(1108, audioContext.currentTime + 0.1); // C#6
      oscillator.frequency.setValueAtTime(1320, audioContext.currentTime + 0.2); // E6

      // Fade out
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    } catch (err) {
      // Silently fail — audio is a nice-to-have, not critical
      console.warn("Audio notification failed:", err);
    }
  };

  /**
   * Sends a browser notification if permission is granted.
   * @param {string} title - Notification title
   * @param {string} body - Notification body text
   */
  const sendNotification = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/logo.png",
        badge: "/logo.png",
      });
      playNotificationSound();
    }
  };

  /**
   * Listen to Firestore 'orders' collection for new incoming orders.
   * Uses docChanges() to detect only newly added documents after initial load.
   */
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Skip the initial load — we don't want to notify for existing orders
      if (ordersInitialLoad.current) {
        ordersInitialLoad.current = false;
        return;
      }

      // Check for newly added documents only
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const order = change.doc.data();
          const customerName = order.customerDetails?.fullName || "Unknown";
          const amount = order.totalAmountPKR?.toLocaleString() || "0";
          const currency = order.currencyUsed || "PKR";

          sendNotification(
            "🛒 New Order Received!",
            `${customerName} placed an order for PKR ${amount} (${currency})`
          );
        }
      });
    });

    return () => unsubscribe();
  }, []);

  /**
   * Listen to Firestore 'contacts' collection for new incoming inquiries.
   * Uses docChanges() to detect only newly added documents after initial load.
   */
  useEffect(() => {
    const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Skip the initial load — we don't want to notify for existing inquiries
      if (contactsInitialLoad.current) {
        contactsInitialLoad.current = false;
        return;
      }

      // Check for newly added documents only
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const inquiry = change.doc.data();
          const name = inquiry.name || "Someone";
          const subject = inquiry.subject || "No Subject";

          sendNotification(
            "📩 New Customer Inquiry!",
            `${name}: "${subject}"`
          );
        }
      });
    });

    return () => unsubscribe();
  }, []);

  // This component is invisible — it only manages side effects
  return null;
}
