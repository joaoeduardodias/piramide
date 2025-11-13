"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState } from "@/hooks/use-form-state"
import { AlertCircle, AlertTriangle, Loader2Icon, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useState, type FormEvent } from "react"
import { createOptionValueAction } from "../../actions"

interface OptionValueProps {
  optionName: string
}

export function FormCreateOptionValue({ optionName }: OptionValueProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false)
  const [valuesText, setValuesText] = useState("")
  const [colors, setColors] = useState<string[]>([])

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    createOptionValueAction,
    async () => {
      formRef.current?.reset();
      setValuesText("");
      setColors([]);
      setIsOptionDialogOpen(false);
      router.push('/admin/products')
    }
  );

  const isColorOption = ["cor", "color"].includes(optionName.toLowerCase());

  const handleValuesChange = (text: string) => {
    setValuesText(text);
    const items = text
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    setColors((prev) => items.map((_, i) => prev[i] || "#000000"));
  };

  const handleColorChange = (index: number, color: string) => {
    setColors((prev) => prev.map((c, i) => (i === index ? color : c)));
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation()

    const form = e.currentTarget;

    const valuesList = valuesText
      .split(",")
      .map(v => v.trim())
      .filter(Boolean);

    const serializedValues = valuesList.map((value, i) => ({
      value,
      content: isColorOption ? colors[i] || null : null,
    }));

    const json = JSON.stringify(serializedValues);

    let hiddenInput = form.querySelector<HTMLInputElement>('input[name="valuesData"]');
    if (!hiddenInput) {
      hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = "valuesData";
      form.appendChild(hiddenInput);
    }
    hiddenInput.value = json;
    await handleSubmit(e);
  };


  return (
    <div className="flex items-center justify-between mb-4">
      <Dialog open={isOptionDialogOpen} onOpenChange={setIsOptionDialogOpen}>
        <DialogTrigger asChild>
          <Button type="button" size="sm" variant="outline">
            <Plus className="size-4 " />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">Adicionar Nova {optionName}</DialogTitle>
          </DialogHeader>

          {/* Exibição de erro */}
          {success === false && message && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Erro encontrado</AlertTitle>
              <AlertDescription>
                <p>{message}</p>
              </AlertDescription>
            </Alert>
          )}

          <DialogDescription className="sr-only">Criação de valor da opção</DialogDescription>


          <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-4">
            <input type="hidden" name="optionName" value={optionName} />
            <div>
              <Label htmlFor="value">Valores *</Label>
              <Input
                id="value"
                value={valuesText}
                onChange={(e) => handleValuesChange(e.target.value)}
                placeholder="Ex: Amarelo, Preto, Branco"
                className="mt-2"
              />
              <span className="text-muted-foreground text-xs">* Coloque os valores separados por vírgula.</span>
              {errors?.value && (
                <p className="text-sm text-red-600 mb-2 flex items-center gap-1">
                  <AlertCircle size={16} />
                  {errors?.value[0]}
                </p>
              )}
            </div>

            {isColorOption && valuesText.trim() && (
              <>
                <div>
                  <Label>Selecione as cores correspondentes</Label>
                  <div className="flex flex-col gap-3 mt-2">
                    {valuesText
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean)
                      .map((value, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="w-24 text-sm text-gray-700">{value}</span>
                          <input
                            type="color"
                            value={colors[i] ?? "#000000"}
                            onChange={(e) => handleColorChange(i, e.target.value)}
                            className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
                          />
                          <Input
                            value={colors[i] ?? "#000000"}
                            onChange={(e) => handleColorChange(i, e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOptionDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="bg-black hover:bg-gray-800">
                {isPending ? <Loader2Icon className="animate-spin" /> : "Adicionar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}