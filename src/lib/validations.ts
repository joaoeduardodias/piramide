export function validateCPF(cpf: string): boolean {

  cpf = cpf.replace(/[^\d]/g, "")


  if (cpf.length !== 11) return false


  if (/^(\d)\1{10}$/.test(cpf)) return false


  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cpf.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== Number.parseInt(cpf.charAt(9))) return false


  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cpf.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== Number.parseInt(cpf.charAt(10))) return false

  return true
}

export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, "")
  return numbers
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14)
}

export function formatCEP(value: string): string {
  const numbers = value.replace(/\D/g, "")
  return numbers.replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9)
}

export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, "")
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d)/, "($1) $2-$3")
  }
  return numbers.replace(/(\d{2})(\d{5})(\d)/, "($1) $2-$3").slice(0, 15)
}

export function formatReal(value: string): string {
  const numbers = value.replace(/\D/g, "")
  if (!numbers) return ""

  const numberValue = (parseInt(numbers, 10) / 100).toFixed(2)
  const [integer, decimal] = numberValue.split(".")

  const withThousands = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  return `R$ ${withThousands},${decimal}`
}

