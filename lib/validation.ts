export interface ValidationError {
  field: string
  message: string
}

export function validateEmail(email: string): ValidationError | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { field: "email", message: "Invalid email format" }
  }
  return null
}

export function validateSkpdForm(data: {
  kode_skpd: string
  nama_skpd: string
  email?: string
  telepon?: string
}): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.kode_skpd || data.kode_skpd.trim().length === 0) {
    errors.push({ field: "kode_skpd", message: "Kode SKPD is required" })
  }

  if (!data.nama_skpd || data.nama_skpd.trim().length === 0) {
    errors.push({ field: "nama_skpd", message: "Nama SKPD is required" })
  }

  if (data.email && !validateEmail(data.email)) {
    errors.push({ field: "email", message: "Invalid email format" })
  }

  if (data.telepon && data.telepon.length < 10) {
    errors.push({ field: "telepon", message: "Telepon must be at least 10 digits" })
  }

  return errors
}

export function validateKodefikasiForm(data: {
  skpd_id: string
  kode_rekening: string
  nama_rekening: string
  anggaran?: number
  realisasi?: number
}): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.skpd_id) {
    errors.push({ field: "skpd_id", message: "SKPD is required" })
  }

  if (!data.kode_rekening || data.kode_rekening.trim().length === 0) {
    errors.push({ field: "kode_rekening", message: "Kode Rekening is required" })
  }

  if (!data.nama_rekening || data.nama_rekening.trim().length === 0) {
    errors.push({ field: "nama_rekening", message: "Nama Rekening is required" })
  }

  if (data.anggaran !== undefined && data.anggaran < 0) {
    errors.push({ field: "anggaran", message: "Anggaran cannot be negative" })
  }

  if (data.realisasi !== undefined && data.realisasi < 0) {
    errors.push({ field: "realisasi", message: "Realisasi cannot be negative" })
  }

  if (data.realisasi !== undefined && data.anggaran !== undefined && data.realisasi > data.anggaran) {
    errors.push({ field: "realisasi", message: "Realisasi cannot exceed Anggaran" })
  }

  return errors
}

export function validateAkunForm(data: {
  email: string
  nama_lengkap: string
  role: string
}): ValidationError[] {
  const errors: ValidationError[] = []

  const emailError = validateEmail(data.email)
  if (emailError) {
    errors.push(emailError)
  }

  if (!data.nama_lengkap || data.nama_lengkap.trim().length === 0) {
    errors.push({ field: "nama_lengkap", message: "Full name is required" })
  }

  if (!data.role) {
    errors.push({ field: "role", message: "Role is required" })
  }

  return errors
}
