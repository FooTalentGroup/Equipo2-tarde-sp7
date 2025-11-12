// components/ColumnFilterDropdown.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";

export type FilterOption = "name" | "email";

type ColumnFilterDropdownProps = {
  visibleColumns: Record<FilterOption, boolean>;
  onToggleColumn: (column: FilterOption) => void;
};

export const ColumnFilterDropdown = ({
  visibleColumns,
  onToggleColumn,
}: ColumnFilterDropdownProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const handleToggleColumn = (column: FilterOption) => onToggleColumn(column);
 

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={toggleFilter}
      >
        Filtrar Columnas ▼
      </Button>
      
      {isFilterOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[200px]">
          <div 
            className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b border-gray-200"
            onClick={() => handleToggleColumn("name")}
          >
            <label className="flex items-center space-x-2 cursor-pointer">
              <Input
                type="checkbox"
                checked={visibleColumns.name}
                readOnly
                className="form-checkbox h-4 w-4"
              />
              <span>Nombre</span>
            </label>
          </div>
          <div 
            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            onClick={() => handleToggleColumn("email")}
          >
            <label className="flex items-center space-x-2 cursor-pointer">
              <Input
                type="checkbox"
                checked={visibleColumns.email}
                readOnly
                className="form-checkbox h-4 w-4"
              />
              <span>Email</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}