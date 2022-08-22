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
    const token: string = this.getToken() as string; //I got an error right here saying string|null is not assignable to type 'string' which is why this.getToken() as string is there
    if (token) { 
      const payload = JSON.parse(atob(token.split('.')[1])); 
      return payload.exp > (Date.now() / 1000); 
    } else { 
      return false;
    }
  }

  public getCurrentUser(): User | undefined { 
    if (this.isLoggedIn()) { 
      const token: string = this.getToken() as string; 
      const { email, name } = JSON.parse(atob(token.split('.')[1])); 
      return { email, name} as User;
    }
  }
}
