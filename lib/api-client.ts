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
    }

    if (data) {
      config.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, config)
      const responseData = await response.json()

      if (!response.ok) {
        throw {
          status: response.status,
          message: responseData.message || "Request failed",
          errors: responseData.errors,
        }
      }

      return responseData
    } catch (error) {
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
    return this.request("/auth/login", "POST", { email, password })
  }

  async register(email: string, password: string, nama_lengkap: string, role = "operator") {
    return this.request("/auth/register", "POST", {
      email,
      password,
      password_confirmation: password,
      nama_lengkap,
      role,
    })
  }

  async logout() {
    return this.request("/auth/logout", "POST")
  }

  async getCurrentUser() {
    return this.request("/auth/me", "GET")
  }

  // SKPD ENDPOINTS
  async getSKPDList() {
    return this.request("/skpd", "GET")
  }

  async getSKPDById(id: string) {
    return this.request(`/skpd/${id}`, "GET")
  }

  async createSKPD(data: unknown) {
    return this.request("/skpd", "POST", data)
  }

  async updateSKPD(id: string, data: unknown) {
    return this.request(`/skpd/${id}`, "PUT", data)
  }

  async deleteSKPD(id: string) {
    return this.request(`/skpd/${id}`, "DELETE")
  }

  // KODEFIKASI ENDPOINTS
  async getKodefikasiList() {
    return this.request("/kodefikasi", "GET")
  }

  async getKodefikasiById(id: string) {
    return this.request(`/kodefikasi/${id}`, "GET")
  }

  async createKodefikasi(data: unknown) {
    return this.request("/kodefikasi", "POST", data)
  }

  async updateKodefikasi(id: string, data: unknown) {
    return this.request(`/kodefikasi/${id}`, "PUT", data)
  }

  async deleteKodefikasi(id: string) {
    return this.request(`/kodefikasi/${id}`, "DELETE")
  }

  // AKUN ENDPOINTS
  async getAkunList() {
    return this.request("/akun", "GET")
  }

  async getAkunById(id: string) {
    return this.request(`/akun/${id}`, "GET")
  }

  async createAkun(data: unknown) {
    return this.request("/akun", "POST", data)
  }

  async updateAkun(id: string, data: unknown) {
    return this.request(`/akun/${id}`, "PUT", data)
  }

  async deleteAkun(id: string) {
    return this.request(`/akun/${id}`, "DELETE")
  }
}

export const apiClient = new ApiClient()
