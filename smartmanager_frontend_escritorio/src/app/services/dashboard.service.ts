import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VentasDiarias, VentasMensuales, ResumenInventario } from '../interfaces/dashboard.interface'; // Importar las interfaces
import { environment } from '../../environments/environment'; // Importar las URLs desde el environment

@Injectable({
  providedIn: 'root', // Hace que el servicio esté disponible globalmente
})
export class DashboardService {
  private apiBaseUrl = environment.apiUrl; // Se usa el baseUrl según el entorno (local o nube)

  constructor(private http: HttpClient) {}

  getResumenInventario(): Observable<ResumenInventario> {
    return this.http.get<ResumenInventario>(`${this.apiBaseUrl}resumen-inventario-diario/`);
  }

  getVentasDiarias(): Observable<VentasDiarias> {
    return this.http.get<VentasDiarias>(`${this.apiBaseUrl}reporte-ventas-diario/`);
  }

  getVentasMensuales(): Observable<VentasMensuales> {
    return this.http.get<VentasMensuales>(`${this.apiBaseUrl}reporte-ventas-mensual/`);
  }
  
  getProductosVendidosPorDia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}productos-vendidos-dia/`);
  }
}
