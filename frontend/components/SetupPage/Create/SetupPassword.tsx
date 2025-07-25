import { Button, Checkbox, Form, Input, Typography } from 'antd';
import { useState } from 'react';

import { useMessageApi } from '@/context/MessageProvider';
import { SetupScreen } from '@/enums/SetupScreen';
import { usePageState } from '@/hooks/usePageState';
import { useSetup } from '@/hooks/useSetup';
import { AccountService } from '@/service/Account';
import { WalletService } from '@/service/Wallet';
import { getErrorMessage } from '@/utils/error';

import { CardFlex } from '../../styled/CardFlex';
import { SetupCreateHeader } from './SetupCreateHeader';

const { Title, Text } = Typography;

export const SetupPassword = () => {
  const { goto, setMnemonic } = useSetup();
  const { setUserLoggedIn } = usePageState();
  const [form] = Form.useForm<{ password: string; terms: boolean }>();
  const message = useMessageApi();
  const [isLoading, setIsLoading] = useState(false);
  const isTermsAccepted = Form.useWatch('terms', form);

  const handleCreateEoa = async ({ password }: { password: string }) => {
    if (!isTermsAccepted) return;

    setIsLoading(true);
    AccountService.createAccount(password)
      .then(() => AccountService.loginAccount(password))
      .then(() => WalletService.createEoa())
      .then(({ mnemonic }: { mnemonic: string[] }) => {
        setMnemonic(mnemonic);
        goto(SetupScreen.SetupSeedPhrase);
        setUserLoggedIn();
      })
      .catch((e: unknown) => {
        message.error(getErrorMessage(e));
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <CardFlex $gap={10} styles={{ body: { padding: '12px 24px' } }} $noBorder>
      <SetupCreateHeader prev={SetupScreen.Welcome} />
      <Title level={3}>Create password</Title>
      <Text>Come up with a strong password.</Text>

      <Form
        name="createEoa"
        form={form}
        onFinish={handleCreateEoa}
        onValuesChange={() => form.validateFields(['terms'])}
      >
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input a Password!' }]}
        >
          <Input.Password size="large" placeholder="Password" />
        </Form.Item>

        <Form.Item name="terms" valuePropName="checked">
          <Checkbox>
            I agree to the Pearl’s{' '}
            <a
              href="https://olas.network/pearl-terms"
              target="_blank"
              rel="noreferrer"
            >
              Terms & Conditions
            </a>
          </Checkbox>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            disabled={!isTermsAccepted}
            loading={isLoading}
            style={{ width: '100%' }}
          >
            Continue
          </Button>
        </Form.Item>
      </Form>
    </CardFlex>
  );
};
