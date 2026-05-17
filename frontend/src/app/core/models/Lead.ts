export interface Lead {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  message?: string;
  property_id?: string;
  agent_id?: string;
  status: string;
  notes?: string;
  created_at?: string;
}