import { Form, FormInstance } from 'antd';
import { noop } from 'lodash';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useState,
} from 'react';

import { ServiceTemplate } from '@/client';
import { SERVICE_TEMPLATES } from '@/constants/serviceTemplates';
import { AgentType } from '@/enums/Agent';
import { Pages } from '@/enums/Pages';
import { usePageState } from '@/hooks/usePageState';
import { useServices } from '@/hooks/useServices';
import { ServicesService } from '@/service/Services';
import { DeepPartial } from '@/types/Util';

import { AgentsFunFormValues } from '../../AgentForms/AgentsFunAgentForm';
import { useConfirmUpdateModal } from '../hooks/useConfirmModal';
import { defaultModalProps, ModalProps } from '../hooks/useModal';
import { useUnsavedModal } from '../hooks/useUnsavedModal';
import { ConfirmUpdateModal } from '../modals/ConfirmUpdateModal';
import { UnsavedModal } from '../modals/UnsavedModal';

export const UpdateAgentContext = createContext<{
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  form?: FormInstance;
  confirmUpdateModal: ModalProps;
  unsavedModal: ModalProps;
}>({
  isEditing: false,
  setIsEditing: noop,
  unsavedModal: defaultModalProps,
  confirmUpdateModal: defaultModalProps,
});

export const UpdateAgentProvider = ({ children }: PropsWithChildren) => {
  const [form] = Form.useForm<DeepPartial<ServiceTemplate>>(); // TODO: wrong type, fix it
  const {
    refetch: refetchServices,
    selectedService,
    selectedAgentType,
  } = useServices();
  const { goto } = usePageState();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Save button loading state

  const confirmUpdateCallback = useCallback(async () => {
    const formValues = form.getFieldsValue();

    if (!selectedService || !selectedService.service_config_id) return;

    setIsSaving(true);

    const currentTemplate = SERVICE_TEMPLATES.find(
      ({ name, agentType }) =>
        name === selectedService.name || agentType === selectedAgentType,
    );

    const agentsFunFormValues = formValues as AgentsFunFormValues;

    const envVariables = (() => {
      if (selectedAgentType === AgentType.AgentsFun) {
        return {
          PERSONA: agentsFunFormValues.personaDescription,
          GENAI_API_KEY: agentsFunFormValues.geminiApiKey,
          FIREWORKS_API_KEY: agentsFunFormValues.fireworksApiEnabled
            ? agentsFunFormValues.fireworksApiKey
            : '',
          TWEEPY_CONSUMER_API_KEY: agentsFunFormValues.xConsumerApiKey,
          TWEEPY_CONSUMER_API_KEY_SECRET:
            agentsFunFormValues.xConsumerApiSecret,
          TWEEPY_BEARER_TOKEN: agentsFunFormValues.xBearerToken,
          TWEEPY_ACCESS_TOKEN: agentsFunFormValues.xAccessToken,
          TWEEPY_ACCESS_TOKEN_SECRET: agentsFunFormValues.xAccessTokenSecret,
        };
      }
      return formValues.env_variables;
    })() as ServiceTemplate['env_variables'];

    const formValuesWithoutEnv =
      selectedAgentType === AgentType.AgentsFun
        ? { description: `Agents.Fun @${agentsFunFormValues.xUsername}` }
        : formValues;

    const partialServiceTemplate = {
      serviceConfigId: selectedService.service_config_id,
      partialServiceTemplate: {
        ...formValuesWithoutEnv,
        env_variables: {
          ...Object.entries(envVariables).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: {
                // Pass the environment variable details
                // in case the variable doesn't exist yet in the service
                ...(currentTemplate?.env_variables?.[key] || {}),
                value, // Update with the value from the form
              },
            }),
            {},
          ),
        },
      },
    };

    try {
      await ServicesService.updateService(partialServiceTemplate);
      await refetchServices?.();
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditing(false);
      setIsSaving(false);
    }
  }, [form, selectedAgentType, selectedService, refetchServices]);

  const confirmUnsavedCallback = useCallback(async () => {
    goto(Pages.Main);
  }, [goto]);

  const confirmUpdateModal = useConfirmUpdateModal({
    confirmCallback: confirmUpdateCallback,
  });

  const unsavedModal = useUnsavedModal({
    confirmCallback: confirmUnsavedCallback,
  });

  return (
    <UpdateAgentContext.Provider
      value={{
        confirmUpdateModal,
        unsavedModal,
        form,
        isEditing,
        setIsEditing,
      }}
    >
      <ConfirmUpdateModal isLoading={isSaving} />
      <UnsavedModal />
      {children}
    </UpdateAgentContext.Provider>
  );
};
