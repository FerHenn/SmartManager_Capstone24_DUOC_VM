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
  
  getProductosVendidosPorDia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}productos-vendidos-dia/`);
  }

  getVentasDiarias(fecha?: string): Observable<any> {
    const url = fecha
      ? `${this.apiBaseUrl}reporte-ventas-diario/?fecha=${fecha}`
      : `${this.apiBaseUrl}reporte-ventas-diario/`;
    return this.http.get(url);
  }

  getVentasMensuales(mes?: string): Observable<any> {
    const url = mes
      ? `${this.apiBaseUrl}reporte-ventas-mensual/?mes=${mes}`
      : `${this.apiBaseUrl}reporte-ventas-mensual/`;
    return this.http.get(url);
  }

  getFechasConVentas(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiBaseUrl}fechas-con-ventas/`);
  }
}
