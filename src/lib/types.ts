export interface Address {
  number: string | null;
  name: string;
  id: string;
  street: string;
  complement: string | null;
  district: string | null;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;

}

export interface UserProfile {
  id: string
  name: string
  email: string
  cpf?: string
  phone?: string
  avatar?: string
  addresses: Address[]
}

export interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}
