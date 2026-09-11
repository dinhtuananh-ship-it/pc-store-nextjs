import { DashboardService } from "@/services/dashboard.service";

export class DashboardController {
  private service = new DashboardService();

  async getStatistics() {
    return this.service.getStatistics();
  }
}