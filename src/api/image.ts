const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const IMAGE_API_URL = `${BASE_URL}/images`;

export const uploadImage = async (
  file: File,
  token: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("images", file);

  const res = await fetch(`${IMAGE_API_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`이미지 업로드 실패: ${res.status}`);
  }

  const data = await res.json();
  return data.images[0];
};
