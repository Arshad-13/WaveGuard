const router = useRouter();

useEffect(() => {
  const auth = getAuth();
  const db = getFirestore();

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      router.push('/login');
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      const alreadyHasLocation =
        userData.latitude !== undefined &&
        userData.longitude !== undefined &&
        userData.region !== undefined;

      if (alreadyHasLocation) {
        console.log("✅ User already has location and region. Skipping...");
        return;
      }
    }

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();

          const region =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.hamlet ||
            data.address.county ||
            'Unknown';

          await updateDoc(userRef, {
            latitude: lat,
            longitude: lng,
            region: region,
          });

          console.log("✅ User location saved:", { lat, lng, region });
        } catch (err) {
          console.error("Failed to reverse geocode or update Firestore:", err);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  });
}, []);
