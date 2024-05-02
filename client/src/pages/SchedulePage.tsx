import { PlaceTabContent, PlaceTabs } from "@/components/schedule/PlaceTabs";
import SearchBox from "@/components/schedule/SearchBox";
import styled from "styled-components";

const SchedulePage = () => {
  return (
    <SchedulePageStyle>
      일정 추가 페이지
      <PlaceTabs>
        <PlaceTabContent title="장소 선택">
          <SearchBox placeholder="장소명을 검색하세요." />
        </PlaceTabContent>
        <PlaceTabContent title="신규 장소 등록">
          <div>신규 장소 등록 영역 </div>
        </PlaceTabContent>
      </PlaceTabs>
    </SchedulePageStyle>
  );
};

const SchedulePageStyle = styled.div``;

export default SchedulePage;
