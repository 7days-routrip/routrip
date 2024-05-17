import React, { useState } from "react";
import styled from "styled-components";

import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";
import { useMapStore } from "@/stores/mapStore";
import { useAddPlaceStore } from "@/stores/addPlaceStore";
import { Button } from "@/components/common/Button";
import { useNearPlacesStore } from "@/stores/nearPlacesStore";
import { useSearchPlacesStore } from "@/stores/searchPlaceStore";
import { useBookmarkPlacesStore } from "@/stores/bookmarkPlacesStore";

interface PlaceTabContentProps {
  title: string;
  children: React.ReactNode;
}

const PlaceTabContent = ({ children }: PlaceTabContentProps) => {
  return <>{children}</>;
};

interface PlaceTabsProps {
  children: React.ReactNode;
  active?: number;
}

const PlaceTabs = ({ children, active = 0 }: PlaceTabsProps) => {
  const { googleMap, updateMapBounds } = useMapStore();
  const { addPlaces } = useAddPlaceStore();
  const { setMarkerType } = useShowMarkerTypeStore();
  const { nearPlaces } = useNearPlacesStore();
  const { searchPlaces } = useSearchPlacesStore();
  const { bookmarkPlaces } = useBookmarkPlacesStore();
  const [activeIndex, setActiveIndex] = useState(active);
  const tabs = React.Children.toArray(children) as React.ReactElement<PlaceTabContentProps>[];

  const onClickHandler = (i: number, title: string) => {
    setActiveIndex(i);

    if (title === "추가한 장소") {
      setMarkerType("add");
      updateMapBounds(googleMap, addPlaces);
    } else if (title === "장소 선택") {
      setMarkerType("searchApi");
      updateMapBounds(googleMap, searchPlaces);
    } else if (title === "신규 장소 등록") {
      setMarkerType("searchGoogle");
      updateMapBounds(googleMap, nearPlaces);
    } else if (title === "내가 찜한 장소") {
      setMarkerType("bookmarkList");
      updateMapBounds(googleMap, bookmarkPlaces);
    }
  };

  return (
    <TabsStyle>
      <div className="tab-header">
        {tabs.map((tab, i) => (
          <Button
            key={i}
            $size="medium"
            $scheme={activeIndex === i ? "primary" : "normal"}
            $radius="tab"
            onClick={() => onClickHandler(i, tab.props.title)}
          >
            {tab.props.title}
          </Button>
        ))}
      </div>
      <div className="tab-content">{tabs[activeIndex]}</div>
    </TabsStyle>
  );
};

const TabsStyle = styled.div`
  width: 100%;

  .tab-header {
    display: flex;

    button {
      flex: 1;
      font-weight: 600;
    }
  }

  .tab-content {
    min-height: 140px;
    border: 1px solid ${({ theme }) => theme.color.borderGray};
    border-top: none;
    border-radius: ${({ theme }) => theme.borderRadius.tabContainer};
    padding: 0.5rem;
  }
`;

export { PlaceTabContent, PlaceTabs };
