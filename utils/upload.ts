export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  const token = "$2a$10$4XqQxtmZeo2iLtWxY4Ld4uDlfKpM2JF5N6DvIC2DEEdohxeyXdZuC";

  try {
    const response = await fetch("http://localhost:5000/api/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
