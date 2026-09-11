import { UserRepository } from "@/repositories/user.repository";
import { ApiResponse } from "@/utils/api-response";

const repository = new UserRepository();

export async function GET() {
  try {
    const users = await repository.findAll();

    const safe = users.map(({ password: _password, ...rest }) => rest);

    return ApiResponse.success(safe);
  } catch (e) {
    return ApiResponse.error(
      e instanceof Error ? e.message : "Error"
    );
  }
}
