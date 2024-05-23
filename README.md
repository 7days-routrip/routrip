# ✈️routrip
![image](https://github.com/7days-routrip/routrip/assets/66871221/bd89a73f-8621-4a7d-940f-bbfa1a51939b)

</br>

## 💡프로젝트 소개
**자신만의 여행 일정을 계획하고 다른 사람들과 여행기를 공유할 수 있는 웹 서비스입니다.**

</br>

## 🔎주요 기능
### 1) 여행 일정 계획 등록 및 조회
<table>
    <tr>
      <td align="center">PC</td>
      <td align="center">모바일</td>
    </tr>
    <tr>
      <td align="center" width="70%"><img src="https://github.com/7days-routrip/routrip/assets/79950091/b7f8109e-6011-4cb1-921a-204fbede240f" /></td>
      <td align="center" width="30%"><img src="https://github.com/7days-routrip/routrip/assets/79950091/0ead3816-4c48-4519-8e9a-c91fc354c568" /></td>
    </tr>
    <tr>
      <td align="center">PC</td>
      <td align="center">모바일</td>
    </tr>
    <tr>
      <td align="center" width="70%"><img src="https://github.com/7days-routrip/routrip/assets/79950091/40aafa73-579a-427e-a138-3e3269dc7814" /></td>
      <td align="center" width="30%"><img src="https://github.com/7days-routrip/routrip/assets/79950091/8b413f72-9bf0-4834-9d2c-6e4772353fee" /></td>
    </tr>
 </table>

### 2) 여행 게시글 작성 및 조회(공유 커뮤니티)
<table>
    <tr>
      <td align="center">PC</td>
      <td align="center">모바일</td>
    </tr>
    <tr>
      <td align="center" width="70%"><img src="https://github.com/7days-routrip/routrip/assets/79950091/5c102e4c-b59f-4267-8f37-0efcc8ee8e92" /></td>
      <td align="center" width="30%"><img src="https://github.com/7days-routrip/routrip/assets/79950091/ca0b2c91-1a65-4d89-91ee-5acb3d8a42e0" /></td>
    </tr>
    <tr>
      <td align="center">PC</td>
      <td align="center">모바일</td>
    </tr>
    <tr>
      <td align="center" width="70%"><img src="https://github.com/7days-routrip/routrip/assets/79950091/09cc8d18-48ae-4b26-8ded-8f80aa46ac23" /></td>
      <td align="center" width="30%"><img src="https://github.com/7days-routrip/routrip/assets/79950091/69cc7e34-61f8-4ee3-9565-9adf9b82b04f" /></td>
    </tr>
 </table>

</br>


## 📌시작하기
이 지침은 개발 및 테스트 목적으로 로컬 머신에 프로젝트를 설정하고 실행하는 방법을 안내합니다. 프로젝트를 라이브 시스템에 배포하는 방법에 대한 설명은 배포 섹션을 참조하세요.

### ✅필수 사항
- env 파일 (backend)
  ```env
  # Database
  DB_USER=
  DB_PASSWORD=
  DB_DATABASE=
  DB_HOST= 
  DB_PORT=
  DB_LIMIT=
  
  # CORS
  CORS_ORIGIN=
  
  # JWT
  JWT_ACCESS_SECRET=
  JWT_ACCESS_EXPIRED_IN=
  JWT_REFRESH_SECRET=
  JWT_REFRESH_EXPIRED_IN=
  
  
  # bcrypt
  SALT_ROUND=
  
  # aws
  ACCESS_KEY=
  SECRET_ACCESS_KEY=
  S3_BUCKET_REGION=
  S3_BUCKET_NAME=
  ```
- env 파일 (frontend)
  ```env
  # Server Base Url
  VITE_BASE_URL=

  # Google Map api key
  VITE_GOOGLE_MAP_API_KEY=
  ```

### ✅설치
개발 환경을 실행하는 단계별 예시를 설명합니다.

다음과 같은 단계로 진행합니다.

```
npm i
```

#### 🌐server 실행

```
npm start
```

#### 🖥️client 실행

```
npm run dev
```

### ⚒️사용된 도구
- 언어 : `TypeScript`
- 빌드도구 : `Vite`
- 라이브러리 : `ReactJs`, `Express`
- CSS : `Styled component`
- 상태관리 : `zustand`, `tanstack query`
- DB :  `MariaDB`, `TypeORM`
- 배포 : `AWS-EC2`, `ECR`

<br/>

## ⚙️아키텍쳐 설계
![image](https://github.com/7days-routrip/routrip/assets/66871221/6292f74c-325b-42bc-b558-007eed246563)

<br/>

## 📝팀 개발 일지 (Notion)
**↗️[7days 팀 노션 페이지 바로가기](https://hongii.notion.site/7-6d96f562bb87469ebeaaab397327f3f7?pvs=4)**

<br/>

## 👥팀원소개
- 프론트엔드
  - 김홍래 :
  - 김홍은 :
  - 이철욱 :
- 백엔드
  - 하종훈 :
  - 황성택 :
  - 전다해 :
