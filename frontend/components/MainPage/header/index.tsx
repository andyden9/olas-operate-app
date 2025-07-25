import { Flex } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { MiddlewareDeploymentStatus } from '@/client';
import { CardSection } from '@/components/styled/CardSection';
import { useBalanceContext } from '@/hooks/useBalanceContext';
import { useElectronApi } from '@/hooks/useElectronApi';
import { useService } from '@/hooks/useService';
import { useServices } from '@/hooks/useServices';

import { FirstRunModal } from '../modals/FirstRunModal';
import { AgentButton } from './AgentButton/AgentButton';
import { AgentHead } from './AgentHead';
import { AgentProfileButton } from './AgentProfileButton';
import { AgentSettingsButton } from './AgentSettingsButton';
import { SupafundSettingsButton } from './SupafundDashboardButton';

const useSetupTrayIcon = () => {
  const { isLowBalance } = useBalanceContext();
  const { selectedService } = useServices();
  const { deploymentStatus } = useService(selectedService?.service_config_id);
  const { setTrayIcon } = useElectronApi();

  useEffect(() => {
    if (isLowBalance) {
      setTrayIcon?.('low-gas');
    } else if (deploymentStatus === MiddlewareDeploymentStatus.DEPLOYED) {
      setTrayIcon?.('running');
    } else if (deploymentStatus === MiddlewareDeploymentStatus.STOPPED) {
      setTrayIcon?.('paused');
    } else if (deploymentStatus === MiddlewareDeploymentStatus.BUILT) {
      setTrayIcon?.('logged-out');
    }
  }, [isLowBalance, deploymentStatus, setTrayIcon]);

  return null;
};

export const MainHeader = () => {
  const [isFirstRunModalOpen, setIsFirstRunModalOpen] = useState(false);
  const handleModalClose = useCallback(() => setIsFirstRunModalOpen(false), []);

  useSetupTrayIcon();
  // TODO: support loading state

  return (
    <CardSection gap={6} padding="8px 24px" justify="space-between">
      <Flex justify="start" align="center" gap={8}>
        <AgentHead />
        <AgentButton />
        <FirstRunModal open={isFirstRunModalOpen} onClose={handleModalClose} />
      </Flex>

      <Flex gap={8} align="center">
        <SupafundSettingsButton />
        <AgentSettingsButton />
        <AgentProfileButton />
      </Flex>
    </CardSection>
  );
};
