import React, { useState } from "react";
import styled from "styled-components";
import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";
import { useMapStore } from "@/stores/mapStore";
import { usePlaceStore } from "@/stores/addPlaceStore";
import { Button } from "@/components/common/Button";

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
  const { places } = usePlaceStore();
  const { setMarkerType } = useShowMarkerTypeStore();
  const [activeIndex, setActiveIndex] = useState(active);
  const tabs = React.Children.toArray(children) as React.ReactElement<PlaceTabContentProps>[];

  const onClickHandler = (i: number, title: string) => {
    setActiveIndex(i);
    if (title === "추가한 장소") {
      setMarkerType("add");
      updateMapBounds(googleMap, places);
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
    min-height: 100px;
    border: 1px solid ${({ theme }) => theme.color.borderGray};
    border-top: none;
    border-radius: ${({ theme }) => theme.borderRadius.tabContainer};
    padding: 0.5rem;
  }
`;

export { PlaceTabContent, PlaceTabs };
