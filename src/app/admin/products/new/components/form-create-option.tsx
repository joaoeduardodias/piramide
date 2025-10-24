"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState } from "@/hooks/use-form-state"
import { AlertCircle, AlertTriangle, Loader2Icon, Settings } from "lucide-react"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { createOptionAction } from "../../actions"

export function FormCreateOption() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false)
  const [optionName, setOptionName] = useState("")
  const [valuesText, setValuesText] = useState("")
  const [colors, setColors] = useState<string[]>([])
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(createOptionAction)

  const isColorOption = optionName.toLowerCase() === "cor"

  const handleValuesChange = (text: string) => {
    setValuesText(text)
    const items = text
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
    setColors(items.map(() => "#000000"))
  }

  const handleColorChange = (index: number, color: string) => {
    setColors((prev) => prev.map((c, i) => (i === index ? color : c)))
  }

  const handleInnerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const form = e.currentTarget
    const formData = new FormData(form)

    const name = (formData.get("name") as string) || ""
    const valuesText = ((formData.get("value") as string) || "")
      .split(",")
      .map(v => v.trim())
      .filter(Boolean)

    const isColorOption = name.toLowerCase() === "cor"

    const values = valuesText.map((value, i) => {

      const contentKey = `content[${i}]`
      const contentRaw = formData.get(contentKey) as string | null
      const content = isColorOption
        ? (contentRaw && contentRaw.trim() !== "" ? contentRaw : null)
        : null

      return {
        value,
        content,
      }
    })

    const contentInputs = Array.from(form.querySelectorAll('input[name^="content["]'))
    contentInputs.forEach((el) => el.remove())

    let hidden = form.querySelector<HTMLInputElement>('input[name="values"]')
    const json = JSON.stringify(values)

    if (!hidden) {
      hidden = document.createElement("input")
      hidden.type = "hidden"
      hidden.name = "values"
      form.appendChild(hidden)
    }
    hidden.value = json

    await handleSubmit(e)
  }

  useEffect(() => {
    if (success) {
      formRef.current?.reset()
      setColors([])
      setIsOptionDialogOpen(false)
    }
  }, [success])


  return (
    <div className="flex items-center justify-between mb-4">
      <Dialog open={isOptionDialogOpen} onOpenChange={setIsOptionDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings size={16} /> Nova Opção
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Opção</DialogTitle>
          </DialogHeader>

          {success === false && message && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Erro encontrado</AlertTitle>
              <AlertDescription>
                <p>{message}</p>
              </AlertDescription>
            </Alert>
          )}

          <DialogDescription className="sr-only">Criação de opção</DialogDescription>

          <form ref={formRef} onSubmit={handleInnerSubmit} className="space-y-4">
            <input type="hidden" name="values" />
            <div>
              <Label htmlFor="name">Nome da Opção *</Label>
              <Input
                id="name"
                name="name"
                value={optionName}
                onChange={(e) => setOptionName(e.target.value)}
                placeholder="Ex: Cor, Tamanho, Material"
                className="mt-2"
              />
              {errors?.name && (
                <p className="text-sm text-red-600 mb-2 flex items-center gap-1">
                  <AlertCircle size={16} />
                  {errors?.name[0]}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="value">Valores *</Label>
              <Input
                id="value"
                name="value"
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
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOptionDialogOpen(false)}>
                Cancelar
              </Button>
              <Button disabled={isPending} className="bg-black hover:bg-gray-800">
                {isPending ? <Loader2Icon className="animate-spin" /> : "Adicionar Opção"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
