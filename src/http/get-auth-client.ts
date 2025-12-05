
// interface GetBrandByIdResponse {
//   brand: {
//     id: string;
//     name: string;
//     slug: string;
//     products: {
//       id: string;
//       name: string;
//     }[];
//   }
// }

// interface GetBrandByIdRequest {
//   id: string
// }

export async function getAuthClient() {
  const res = await fetch("/api/auth/session")
  if (!res.ok) return
  const result = await res.json()
  return result
}