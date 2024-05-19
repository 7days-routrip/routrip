import React from "react";
import { Region, Country } from "@/data/region";

interface RegionCountrySelectorProps {
  regions: Region[];
  selectedRegion: number;
  selectedCountry: number;
  countries: Country[];
  onRegionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onCountryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  hideKorea?: boolean;
}

const RegionCountrySelector: React.FC<RegionCountrySelectorProps> = ({
  regions,
  selectedRegion,
  selectedCountry,
  countries,
  onRegionChange,
  onCountryChange,
  hideKorea = false,
}) => {
  const filteredCountries = hideKorea ? countries.filter((country) => country.name !== "대한민국") : countries;

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
      <select className="country" onChange={onCountryChange} value={selectedCountry}>
        <option value="0">전체</option>
        {filteredCountries.map((country) => (
          <option key={country.id} value={country.id}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegionCountrySelector;
