import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8100'; // Cambia esto si usas otro puerto

  constructor() {}

  async getProductos() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/productos/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching productos:', error);
      throw error;
    }
  }
}

