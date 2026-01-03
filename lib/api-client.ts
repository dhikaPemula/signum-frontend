/**
 * API Client untuk komunikasi dengan Laravel Backend
 * Semua request HTTP dilakukan melalui client ini
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string[]>
}

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    this.loadToken()
  }

  private loadToken() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem("auth_token", token)
    } else {
      localStorage.removeItem("auth_token")
    }
  }

  private async request<T>(method: string, endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    const config: RequestInit = {
      method,
      headers,
      credentials: 'include',
    }

    if (data) {
      config.body = JSON.stringify(data)
    }

    try {
      console.log(`[API] ${method} ${url}`, data || '')
      const response = await fetch(url, config)
      const responseData = await response.json()
      
      console.log(`[API Response] ${method} ${url}:`, response.status, responseData)

      if (!response.ok) {
        throw {
          status: response.status,
          message: responseData.message || "Request failed",
          errors: responseData.errors,
        }
      }

      // Jika response dari Laravel tidak punya field success, tambahkan otomatis
      return {
        success: true,
        ...responseData
      }
    } catch (error) {
      console.error(`[API Error] ${method} ${url}:`, error)
      if (error instanceof Error) {
        throw {
          status: 500,
          message: error.message,
        }
      }
      throw error
    }
  }

  // AUTH ENDPOINTS
  async login(email: string, password: string) {
    return this.request("POST", "/auth/login", { email, password })
  }

  async register(email: string, password: string, nama_lengkap: string, role = "operator") {
    return this.request("POST", "/auth/register", {
      email,
      password,
      password_confirmation: password,
      nama_lengkap,
      role,
    })
  }

  async logout() {
    return this.request("POST", "/auth/logout", undefined)
  }

  async getCurrentUser() {
    return this.request("GET", "/auth/me", undefined)
  }

  // SKPD ENDPOINTS
  async getSKPDList() {
    return this.request("GET", "/skpd", undefined)
  }

  async getSKPDById(id: string) {
    return this.request("GET", `/skpd/${id}`, undefined)
  }

  async createSKPD(data: unknown) {
    return this.request("POST", "/skpd", data)
  }

  async updateSKPD(id: string, data: unknown) {
    return this.request("PUT", `/skpd/${id}`, data)
  }

  async deleteSKPD(id: string) {
    return this.request("DELETE", `/skpd/${id}`, undefined)
  }

  // KODEFIKASI ENDPOINTS
  async getKodefikasiList() {
    return this.request("GET", "/kodefikasi", undefined)
  }

  async getKodefikasiById(id: string) {
    return this.request("GET", `/kodefikasi/${id}`, undefined)
  }

  async createKodefikasi(data: unknown) {
    return this.request("POST", "/kodefikasi", data)
  }

  async updateKodefikasi(id: string, data: unknown) {
    return this.request("PUT", `/kodefikasi/${id}`, data)
  }

  async deleteKodefikasi(id: string) {
    return this.request("DELETE", `/kodefikasi/${id}`, undefined)
  }

  // AKUN ENDPOINTS
  async getAkunList() {
    return this.request("GET", "/akun", undefined)
  }

  async getAkunById(id: string) {
    return this.request("GET", `/akun/${id}`, undefined)
  }

  async createAkun(data: unknown) {
    return this.request("POST", "/akun", data)
  }

  async updateAkun(id: string, data: unknown) {
    return this.request("PUT", `/akun/${id}`, data)
  }

  async deleteAkun(id: string) {
    return this.request("DELETE", `/akun/${id}`, undefined)
  }
}

export const apiClient = new ApiClient()
