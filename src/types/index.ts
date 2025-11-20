export interface Link {
  id: number;
  code: string;
  target_url: string;
  total_clicks: number;
  last_clicked: string | null;
  created_at: string;
}

export interface CreateLinkRequest {
  target_url: string;
  custom_code?: string;
}

export interface CreateLinkResponse {
  success: boolean;
  data?: Link;
  error?: string;
}

export interface LinkStats extends Link {
  short_url: string;
}