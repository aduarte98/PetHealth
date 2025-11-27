import React, { useState, createContext, useContext, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";

const SelectContext = createContext(null);

export const Select = ({ children, onValueChange, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || "");
  const containerRef = useRef(null);

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newValue) => {
    setValue(newValue);
    if (onValueChange) onValueChange(newValue);
    setIsOpen(false);
  };

  return (
    <SelectContext.Provider value={{ isOpen, setIsOpen, value, handleSelect }}>
      <div className="relative w-full" ref={containerRef}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ children, className }) => {
  const { isOpen, setIsOpen } = useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
      <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
};

export const SelectValue = ({ placeholder }) => {
  const { value } = useContext(SelectContext);
  // Tenta mostrar o valor selecionado, senão mostra o placeholder
  // Nota: Em um select complexo, precisariamos mapear valor -> label, mas aqui simplificamos
  return <span className="block truncate">{value || placeholder}</span>;
};

export const SelectContent = ({ children, className }) => {
  const { isOpen } = useContext(SelectContext);
  
  if (!isOpen) return null;

  return (
    <div className={`absolute z-50 min-w-[8rem] w-full overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md animate-in fade-in-80 mt-1 ${className}`}>
      <div className="p-1 max-h-60 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export const SelectItem = ({ children, value, className }) => {
  const { handleSelect, value: selectedValue } = useContext(SelectContext);
  const isSelected = selectedValue === value;

  return (
    <div
      onClick={() => handleSelect(value)}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 cursor-pointer ${isSelected ? 'bg-blue-50 text-blue-900' : ''} ${className}`}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4 text-blue-600" />}
      </span>
      <span className="truncate">{children}</span>
    </div>
  );
};