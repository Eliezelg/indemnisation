'use client';

import { useState, useEffect, useRef } from 'react';

interface Airline {
  code: string;
  icao: string | null;
  name: string;
  country: string;
  alliance: string | null;
}

interface AirlineAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export default function AirlineAutocomplete({
  value,
  onChange,
  label,
  placeholder,
  required = false,
  error,
}: AirlineAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [allAirlines, setAllAirlines] = useState<Airline[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load all airlines on mount
  useEffect(() => {
    const loadAirlines = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/airlines`
        );
        if (response.ok) {
          const data = await response.json();
          setAllAirlines(data);
        }
      } catch (error) {
        console.error('Error loading airlines:', error);
      }
    };

    loadAirlines();
  }, []);

  // Update query when value changes from outside
  useEffect(() => {
    if (value) {
      const airline = allAirlines.find((a) => a.code === value);
      if (airline) {
        setQuery(`${airline.code} - ${airline.name}`);
      }
    } else {
      setQuery('');
    }
  }, [value, allAirlines]);

  // Search airlines with debounce
  useEffect(() => {
    if (!query || query.length < 2) {
      setAirlines([]);
      return;
    }

    const searchAirlines = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/airlines/search?q=${encodeURIComponent(query)}`
        );
        if (response.ok) {
          const data = await response.json();
          setAirlines(data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Error searching airlines:', error);
        setAirlines([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchAirlines, 300); // Debounce 300ms
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setHighlightedIndex(0);

    // Clear selection if user clears input
    if (!newQuery) {
      onChange('');
    }
  };

  const handleSelect = (airline: Airline) => {
    setQuery(`${airline.code} - ${airline.name}`);
    onChange(airline.code);
    setIsOpen(false);
    setAirlines([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || airlines.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < airlines.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (airlines[highlightedIndex]) {
          handleSelect(airlines[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleFocus = () => {
    if (query.length >= 2 && airlines.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder || 'Rechercher par code ou nom...'}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        required={required}
        autoComplete="off"
      />

      {/* Loading indicator */}
      {loading && (
        <div className="absolute right-3 top-9 text-gray-400">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && airlines.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {airlines.map((airline, index) => (
            <button
              key={airline.code}
              type="button"
              onClick={() => handleSelect(airline)}
              className={`w-full text-left px-4 py-2 hover:bg-indigo-50 cursor-pointer transition-colors ${
                index === highlightedIndex ? 'bg-indigo-100' : ''
              }`}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-indigo-600">
                    {airline.code}
                  </span>
                  <span className="text-gray-700 ml-2">{airline.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {airline.alliance && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {airline.alliance}
                    </span>
                  )}
                  <span className="text-sm text-gray-500">{airline.country}</span>
                </div>
              </div>
              {airline.icao && (
                <div className="text-xs text-gray-500 mt-0.5">
                  ICAO: {airline.icao}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && query.length >= 2 && !loading && airlines.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
          Aucune compagnie aérienne trouvée
        </div>
      )}

      {/* Error message */}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
