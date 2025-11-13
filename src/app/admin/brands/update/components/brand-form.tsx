"use client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState } from "@/hooks/use-form-state"
import { generateSlug } from "@/utils/generate-slug"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Brand {
  id: string;
  name: string;
  slug: string;
  products: {
    id: string;
    name: string;
  }[];
}

interface BrandFormProps {
  action: (formData: FormData) => Promise<any>
  initialData?: Brand
}


export function BrandForm({ action, initialData }: BrandFormProps) {
  const router = useRouter()
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(action,
    () => {
      router.push("/admin/brands")
    }
  )
  const [slug, setSlug] = useState(initialData?.slug || "")

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    if (!initialData) {
      setSlug(generateSlug(name))
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Dados principais da marca</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input type="hidden" name="id" value={initialData?.id} />
            {success === false && message && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">
                Nome da Marca <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex: Adidas, Nike"
                defaultValue={initialData?.name}
                onChange={handleNameChange}
                className={errors?.name ? "border-destructive" : ""}
                required
              />
              {errors?.name && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {errors.name[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug (URL) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="slug"
                name="slug"
                placeholder="tenis-esportivos"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={errors?.slug ? "border-destructive" : ""}
                required
              />
              {errors?.slug && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {errors.slug[0]}
                </p>
              )}
              <p className="text-xs text-muted-foreground">URL: /marca/{slug || "slug-da-marca"}</p>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col-reverse gap-2 sm:flex-row justify-end w-full">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? "Salvando..." : "Salvar Marca"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
