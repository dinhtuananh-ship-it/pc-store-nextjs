import bcrypt from "bcrypt";
import { UserRepository } from "@/repositories/user.repository";
import { RegisterInput } from "@/validations/auth.validation";
import {LoginInput} from "@/validations/login.validation";

export class AuthService {
  private userRepository = new UserRepository();

  async register(data: RegisterInput) {
    const existedUser = await this.userRepository.findByEmail(data.email);

    if (existedUser) {
      throw new Error("Email đã tồn tại");
    }

    const customerRole =
      await this.userRepository.findCustomerRole();

    if (!customerRole) {
      throw new Error("Role Customer không tồn tại");
    }

    const hashedPassword =
      await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
      roleId: customerRole.id,
    });

    const { password: _password, ...safeUser } = user;

    return safeUser;
  }
  async login(data: LoginInput) {
  const user = await this.userRepository.findByEmail(data.email);

  if (!user) {
    throw new Error("Email không tồn tại");
  }

  const isMatch = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Sai mật khẩu");
  }

  await this.userRepository.updateLastLogin(user.id);

  const { password: _password, ...safeUser } = user;

  return safeUser;
}
}
