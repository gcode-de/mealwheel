// export default async function updateLikes(recipeId, likeChange, mutate) {
//   let currentLikes;
//   await mutate((data) => {
//     currentLikes = data;
//     return { ...data, likes: data.likes + likeChange };
//   }, false);

//   try {
//     const response = await fetch(`/api/recipes/${recipeId}/like`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ likeChange }),
//     });

//     if (!response.ok) {
//       throw new Error("Something went wrong with updating likes.");
//     }

//     const data = await response.json();
//     mutate();
//     return data;
//   } catch (error) {
//     console.error(error);
//     await mutate(currentLikes, false);
//   }
// }

export default async function updateLikes(recipeId, likeChange, mutate) {
  try {
    // Optimistisches Update: UI sofort aktualisieren
    mutate((currentData) => {
      if (currentData) {
        return {
          ...currentData,
          likes: currentData.likes + likeChange,
        };
      }
      return currentData;
    }, false);

    // Den Server-Request ausführen
    const response = await fetch(`/api/recipes/${recipeId}/like`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likeChange }),
    });

    if (!response.ok) {
      throw new Error("Something went wrong with updating likes.");
    }

    // Nach erfolgreichem Update die Daten vom Server erneut abrufen
    mutate();
  } catch (error) {
    console.error(error);
    // Bei einem Fehler die Daten mit dem Server synchronisieren, um Inkonsistenzen zu vermeiden
    mutate();
  }
}
