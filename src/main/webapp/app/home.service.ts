import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationConfigService } from './core/config/application-config.service';
import { Observable } from 'rxjs';
import { UsersPasswords } from './entities/users-passwords/users-passwords.model';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  getAllPasswords(): Observable<UsersPasswords[]> {
    const url = this.applicationConfigService.getEndpointFor('api/users-passwords');
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    return this.http.get<UsersPasswords[]>(url);
  }
}
