import { Inject, Injectable } from "@angular/core";
import { BROWSER_STORAGE } from "./storage";
import { User } from "./models/user"; 
import { AuthResponse } from "./models/authresponse";
import { TripDataService } from "./services/trip-data.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage, 
    private tripDataService: TripDataService
  ) {}

  public getToken(): string | null { //got an error here saying it couldn't be returned without declaring it like Ln 40
    return this.storage.getItem('travlr-token'); 
  }

  public saveToken(token: string): void { 
    this.storage.setItem('travlr-token', token);
  }

  public login(user: User): Promise<any> { 
    return this.tripDataService.login(user) 
      .then((authResp : AuthResponse) => this.saveToken(authResp.token as unknown as string)); //it was saying function was not a parameter sooo the error went away with as unknown 
  }

  public register(user: User): Promise<any> { 
    return this.tripDataService.login(user) 
      .then((authResp: AuthResponse) => this.saveToken(authResp.token as unknown as string)); //it was saying function was not a parameter sooo the error went away with as unknown 
  }

  public logout(): void { 
    this.storage.removeItem('travlr-token');
  }

  public isLoggedIn(): boolean {
    return this.getSession() !== undefined;
  }

  public isAdmin(): boolean {
    return this.getSession()?.role === 'admin';
  }

  public getCurrentUser(): User | undefined {
    const session = this.getSession();
    return session && { email: session.email, name: session.name };
  }

  private getSession(): { email: string; name: string; role?: string; exp: number } | undefined {
    const payload = this.getToken()?.split('.')[1];
    if (!payload) return undefined;

    try {
      const session = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return session?.exp > Date.now() / 1000 ? session : undefined;
    } catch {
      return undefined;
    }
  }
}
