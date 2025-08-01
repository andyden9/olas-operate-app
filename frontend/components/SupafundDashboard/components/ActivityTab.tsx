import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { Empty, List, Tag, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

interface Activity {
  id: string;
  type: 'POSITION_OPENED' | 'POSITION_CLOSED' | 'MARKET_ANALYSIS';
  title: string;
  description: string;
  timestamp: string;
  result?: {
    pnl?: number;
    confidence?: string;
  };
}

interface ActivityTabProps {
  activities: Activity[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'POSITION_OPENED':
      return <SwapOutlined style={{ color: '#1890ff' }} />;
    case 'POSITION_CLOSED':
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    case 'MARKET_ANALYSIS':
      return <CloseCircleOutlined style={{ color: '#faad14' }} />;
    default:
      return null;
  }
};

const getActivityTypeTag = (type: string) => {
  switch (type) {
    case 'POSITION_OPENED':
      return <Tag color="blue">Position Opened</Tag>;
    case 'POSITION_CLOSED':
      return <Tag color="green">Position Closed</Tag>;
    case 'MARKET_ANALYSIS':
      return <Tag color="orange">Market Analysis</Tag>;
    default:
      return null;
  }
};

export const ActivityTab: React.FC<ActivityTabProps> = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <Empty description="No recent activity" style={{ padding: '40px 0' }} />
    );
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={activities}
      pagination={{ pageSize: 8, simple: true }}
      size="small"
      renderItem={(activity) => (
        <List.Item style={{ padding: '8px 0' }}>
          <List.Item.Meta
            avatar={getActivityIcon(activity.type)}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <Text style={{ fontSize: '13px' }}>{activity.title}</Text>
                  {getActivityTypeTag(activity.type)}
                </div>
                <Text type="secondary" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                  {activity.timestamp}
                </Text>
              </div>
            }
            description={
              <div style={{ fontSize: '12px' }}>
                <Text type="secondary" style={{ fontSize: '11px' }}>{activity.description}</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap', gap: '8px' }}>
                  {activity.result?.pnl !== undefined && (
                    <Text
                      style={{
                        color: activity.result.pnl >= 0 ? '#3f8600' : '#cf1322',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}
                    >
                      P&L: {activity.result.pnl >= 0 ? '+' : ''}$
                      {activity.result.pnl.toFixed(2)}
                    </Text>
                  )}
                  {activity.result?.confidence && (
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      Confidence: {activity.result.confidence}
                    </Text>
                  )}
                </div>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
};
