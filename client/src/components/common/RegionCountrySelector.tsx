import React from "react";
import { Region } from "@/data/region";

interface RegionCountrySelectorProps {
  regions: Region[];
  selectedRegion: number;
  countries: string[];
  onRegionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const RegionCountrySelector: React.FC<RegionCountrySelectorProps> = ({
  regions,
  selectedRegion,
  countries,
  onRegionChange,
}) => {
  return (
    <div className="continent-country">
      <select className="continent" onChange={onRegionChange} value={selectedRegion}>
        <option value="0">전체</option>
        {regions.map((region) => (
          <option key={region.id} value={region.id}>
            {region.name}
          </option>
        ))}
      </select>
      <select className="country">
        <option value="0">전체</option>
        {countries.map((country, index) => (
          <option key={index} value={country}>
            {country}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegionCountrySelector;
