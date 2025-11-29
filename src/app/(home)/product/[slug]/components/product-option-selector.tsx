"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductOptionSelectorProps {
  option: {
    id: string;
    name: string;
    values: {
      id: string;
      value: string;
      content: string | null;
    }[];
  }
  selectedValue: string
  onValueChange: (optionId: string, valueId: string) => void
  error?: boolean
}

export function ProductOptionSelector({ option, selectedValue, onValueChange, error = false }: ProductOptionSelectorProps) {
  const hasColorContent = option.values.some((v) => v.content && v.content.startsWith("#"))

  // classe de destaque quando há erro
  const containerBorderClass = error ? "border-red-500 ring-1 ring-red-500" : "border-transparent"

  if (hasColorContent) {
    return (
      <div >
        <h3 className={`font-semibold mb-3 `}>
          {option.name}:{" "}
          {selectedValue ? (
            <span className="text-gray-600 font-normal">
              {option.values.find((v) => v.id === selectedValue)?.value}
            </span>
          ) : (
            <span className="text-gray-400 font-normal">Selecione</span>
          )}
        </h3>
        <div className="flex flex-wrap gap-2">
          {option.values.map((value) => (
            <button
              key={value.id}
              onClick={() => onValueChange(option.id, value.id)}
              className={cn(
                "relative w-10 h-10 rounded-full border-2 transition-all",
                selectedValue === value.id
                  ? "border-black ring-2 ring-black ring-offset-2"
                  : "border-gray-300 hover:border-gray-400",
              )}
              title={value.value}
              style={{ backgroundColor: value.content || "#cccccc" }}
              aria-pressed={selectedValue === value.id}
            >
              {value.content === "#FFFFFF" && <span className="absolute inset-0 rounded-full border border-gray-200" />}
            </button>
          ))}
        </div>
        {error && <p id={`${option.id}-error`} className="mt-2 text-sm text-red-600">Selecione o(a) {option.name.toLowerCase()}</p>}
      </div>
    )
  }

  return (
    <div>
      <h3 className="font-semibold mb-3 text-gray-900">
        {option.name}:{" "}
        {selectedValue ? (
          <span className="text-gray-600 font-normal">{option.values.find((v) => v.id === selectedValue)?.value}</span>
        ) : (
          <span className="text-gray-400 font-normal">Selecione</span>
        )}
      </h3>
      <div className="flex flex-wrap gap-2">
        {option.values.map((value) => (
          <Button
            key={value.id}
            onClick={() => onValueChange(option.id, value.id)}
            variant="outline"
            className={cn(
              "border-2 transition-all font-medium",
              selectedValue === value.id
                ? "border-black bg-black text-white hover:bg-black hover:text-white"
                : "border-gray-300 hover:border-gray-400 bg-white text-gray-900",
            )}
            aria-pressed={selectedValue === value.id}
          >
            {value.value}
          </Button>
        ))}
      </div>
      {error && <p id={`${option.id}-error`} className="mt-2 text-sm text-red-600">Selecione o(a) {option.name.toLowerCase()}</p>}
    </div>
  )
}
