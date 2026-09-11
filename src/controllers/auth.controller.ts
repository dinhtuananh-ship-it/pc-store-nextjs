import { AuthService } from "@/services/auth.service";
import { RegisterInput } from "@/validations/auth.validation";
import {LoginInput} from "@/validations/login.validation";

export class AuthController {

  private authService = new AuthService();

  async register(data: RegisterInput) {

    return this.authService.register(data);

  }
async login(data: LoginInput) {
  return this.authService.login(data);
}
}