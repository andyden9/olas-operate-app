import { SwapOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { Pages } from '@/enums/Pages';
import { usePageState } from '@/hooks/usePageState';

export const SwitchAgentButton = () => {
  const { goto } = usePageState();

  return (
    <Button
      type="text"
      icon={<SwapOutlined />}
      onClick={() => goto(Pages.SwitchAgent)}
      size="small"
      style={{ 
        color: '#666',
        fontSize: '12px',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}
    >
      Switch
    </Button>
  );
};