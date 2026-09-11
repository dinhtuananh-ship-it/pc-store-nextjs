import { DashboardRepository } from "@/repositories/dashboard.repository";

export class DashboardService {
  private repository = new DashboardRepository();

  async getStatistics() {
    return this.repository.getStatistics();
  }
}