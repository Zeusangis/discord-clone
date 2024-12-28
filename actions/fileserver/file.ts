const fileUrl = "http://localhost:8000/file";

export default async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(fileUrl, {
    method: "POST",
    body: formData,
  });
  return response.json();
}
