// Define the structure for a country within a region
export interface Country {
  name: string;
}

// Define the structure for a region
export interface Region {
  id: number;
  name: string;
  countries: string[]; // Array of country names
}

// Define the regions array
export const regions: Region[] = [
  { id: 1, name: "동아시아", countries: ["대한민국", "일본", "중국", "대만"] },
  { id: 2, name: "동남아시아", countries: ["필리핀", "베트남", "태국", "인도네시아", "싱가포르"] },
  {
    id: 3,
    name: "유럽",
    countries: [
      "영국",
      "프랑스",
      "이탈리아",
      "독일",
      "스위스",
      "벨기에",
      "스페인",
      "그리스",
      "스웨덴",
      "체코/슬로바키아",
      "폴란드",
      "터키",
    ],
  },
  { id: 4, name: "남아메리카", countries: ["브라질", "아르헨티나", "칠레", "페루", "콜롬비아"] },
  { id: 5, name: "북아메리카", countries: ["미국", "캐나다", "멕시코"] },
  { id: 6, name: "오세아니아", countries: ["호주", "뉴질랜드"] },
];
