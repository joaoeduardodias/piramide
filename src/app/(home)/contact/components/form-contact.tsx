"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { useState, type FormEvent } from "react"


export function FormContact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  })


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const phoneNumber = "551736322574";

    const text = `
Olá! 👋 Me chamo ${formData.firstName} ${formData.lastName}.
Gostaria de entrar em contato com vocês.

📧 Email: ${formData.email}
📞 Telefone: ${formData.phone}
📝 Mensagem: ${formData.message}
    `;

    const encodedMessage = encodeURIComponent(text.trim());

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            Nome
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Seu nome"
            className="h-12"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Sobrenome
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Seu sobrenome"
            className="h-12"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="seu@email.com"
          className="h-12"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Telefone
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(11) 99999-9999"
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-gray-700">
          Mensagem
        </Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Como podemos ajudar?"
          rows={6}
          className="resize-none"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gray-900 hover:bg-gray-800 text-white h-12 text-base font-semibold"
      >
        <Send className="w-4 h-4 mr-2" />
        Enviar Mensagem
      </Button>
    </form>
  )
}