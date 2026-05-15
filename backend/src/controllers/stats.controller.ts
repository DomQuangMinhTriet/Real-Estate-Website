import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

/**
 * Lấy dữ liệu thống kê tổng quan cho Dashboard
 */
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    const isAdmin = user?.role === 'admin';
    let stats: any = {};

    // Tổng số BĐS
    let propQuery = supabase.from('properties').select('*', { count: 'exact', head: true }).eq('is_deleted', false);
    if (!isAdmin) propQuery = propQuery.eq('agent_id', user?.id);
    const { count: propertiesCount } = await propQuery;
    stats.properties = propertiesCount || 0;

    // Tổng số Leads
    let leadQuery = supabase.from('leads').select('*', { count: 'exact', head: true });
    if (!isAdmin) leadQuery = leadQuery.eq('agent_id', user?.id);
    const { count: leadsCount } = await leadQuery;
    stats.leads = leadsCount || 0;

    if (isAdmin) {
      // Đếm bài viết chờ duyệt
      const { count: pendingPosts } = await supabase.from('forum_posts').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      stats.pending_posts = pendingPosts || 0;

      // Đếm yêu cầu làm môi giới chờ duyệt
      const { count: pendingAgents } = await supabase.from('agent_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      stats.pending_agents = pendingAgents || 0;
    }

    res.status(200).json({ status: 'success', data: stats });
  } catch (error) {
    next(error);
  }
};