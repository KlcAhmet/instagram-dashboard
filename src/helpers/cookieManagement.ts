export function getAllCookies(): {} {
  const cookies = document.cookie // Tüm cookie'leri bir string olarak al

  if (cookies === "") {
    return {} // Eğer herhangi bir cookie yoksa boş bir obje döndür
  }

  const cookieArray = cookies.split(";") // Cookie'leri ayır
  const cookieObject = {}

  for (const cookie of cookieArray) {
    const [name, value] = cookie.split("=").map((part) => part.trim()) // Her bir cookie'yi ad ve değer olarak ayır
    // @ts-ignore
    cookieObject[name] = value // Ad ve değeri objeye ekle
  }

  return cookieObject
}
