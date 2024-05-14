export interface Country {
  id: number;
  name: string;
}

export interface Region {
  id: number;
  name: string;
  countries: Country[];
}

export const regions: Region[] = [
  {
    id: 1,
    name: "동아시아",
    countries: [
      { id: 1, name: "대한민국" },
      { id: 2, name: "일본" },
      { id: 3, name: "중국" },
      { id: 4, name: "대만" },
    ],
  },
  {
    id: 2,
    name: "동남아시아",
    countries: [
      { id: 5, name: "필리핀" },
      { id: 6, name: "베트남" },
      { id: 7, name: "태국" },
      { id: 8, name: "인도네시아" },
      { id: 9, name: "싱가포르" },
    ],
  },
  {
    id: 3,
    name: "유럽",
    countries: [
      { id: 10, name: "영국" },
      { id: 11, name: "프랑스" },
      { id: 12, name: "이탈리아" },
      { id: 13, name: "독일" },
      { id: 14, name: "스위스" },
      { id: 15, name: "벨기에" },
      { id: 16, name: "스페인" },
      { id: 17, name: "그리스" },
      { id: 18, name: "스웨덴" },
      { id: 19, name: "체코/슬로바키아" },
      { id: 20, name: "폴란드" },
      { id: 21, name: "터키" },
    ],
  },
  {
    id: 4,
    name: "남아메리카",
    countries: [
      { id: 22, name: "브라질" },
      { id: 23, name: "아르헨티나" },
      { id: 24, name: "칠레" },
      { id: 25, name: "페루" },
      { id: 26, name: "콜롬비아" },
    ],
  },
  {
    id: 5,
    name: "북아메리카",
    countries: [
      { id: 27, name: "미국" },
      { id: 28, name: "캐나다" },
      { id: 29, name: "멕시코" },
    ],
  },
  {
    id: 6,
    name: "오세아니아",
    countries: [
      { id: 30, name: "호주" },
      { id: 31, name: "뉴질랜드" },
    ],
  },
];
