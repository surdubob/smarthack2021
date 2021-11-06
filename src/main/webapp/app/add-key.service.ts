import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationConfigService } from './core/config/application-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddKeyService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  generateKey(type: string): Observable<string> {
    const url = this.applicationConfigService.getEndpointFor('api/users-passwords');
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    return this.http.get(url.concat('/generate-key/').concat(type), { headers, responseType: 'text' as const });
  }
}
