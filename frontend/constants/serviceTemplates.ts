import { ethers } from 'ethers';

import { EnvProvisionType, MiddlewareChain, ServiceTemplate } from '@/client';
import { MODE_TOKEN_CONFIG, OPTIMISM_TOKEN_CONFIG } from '@/config/tokens';
import { AgentType } from '@/enums/Agent';
import { STAKING_PROGRAM_IDS } from '@/enums/StakingProgram';
import { TokenSymbol } from '@/enums/Token';
import { parseEther, parseUnits } from '@/utils/numberFormatters';

// Use DEV_RPC or fallback to localhost for development
const DEFAULT_RPC =
  process.env.DEV_RPC || process.env.GNOSIS_RPC || 'http://localhost:8545';

/**
 * Prefix for KPI description in service templates.
 * This is used track services that are part of the Pearl service suite.
 */
export const KPI_DESC_PREFIX = '[Pearl service]';

export const PREDICT_SERVICE_TEMPLATE: ServiceTemplate = {
  agentType: AgentType.PredictTrader, // TODO: remove if causes errors on middleware
  name: 'Trader Agent', // should be unique across all services and not be updated
  hash: 'bafybeidatmzo4m65sjdfha2aurz4mvsdxeu7coom2zcnfbnwpeyfsn4mza',
  description: `${KPI_DESC_PREFIX} Trader agent for omen prediction markets`,
  image:
    'https://operate.olas.network/_next/image?url=%2Fimages%2Fprediction-agent.png&w=3840&q=75',
  service_version: 'v0.25.11',
  home_chain: MiddlewareChain.GNOSIS,
  configurations: {
    [MiddlewareChain.GNOSIS]: {
      staking_program_id: STAKING_PROGRAM_IDS.PearlBeta, // default, may be overwritten
      nft: 'bafybeig64atqaladigoc3ds4arltdu63wkdrk3gesjfvnfdmz35amv7faq',
      rpc: DEFAULT_RPC, // overwritten
      agent_id: 14,
      threshold: 1,
      use_staking: true,
      use_mech_marketplace: false,
      // TODO: pull fund requirements from staking program config
      cost_of_bond: +parseEther(0.001),
      monthly_gas_estimate: +parseEther(10),
      fund_requirements: {
        [ethers.constants.AddressZero]: {
          agent: +parseEther(2),
          safe: +parseEther(5),
        },
      },
    },
  },
  env_variables: {
    GNOSIS_LEDGER_RPC: {
      name: 'Gnosis ledger RPC',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    STAKING_CONTRACT_ADDRESS: {
      name: 'Staking contract address',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    MECH_MARKETPLACE_CONFIG: {
      name: 'Mech marketplace configuration',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    MECH_ACTIVITY_CHECKER_CONTRACT: {
      name: 'Mech activity checker contract',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    MECH_CONTRACT_ADDRESS: {
      name: 'Mech contract address',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    MECH_REQUEST_PRICE: {
      name: 'Mech request price',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    USE_MECH_MARKETPLACE: {
      name: 'Use Mech marketplace',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    TOOLS_ACCURACY_HASH: {
      name: 'Tools accuracy hash',
      description: '',
      value: 'QmbyrbZkQEUYHkXzwBqkmRSNqzcQLS7QpebB2xgjjBR1zP',
      provision_type: EnvProvisionType.FIXED,
    },
    MECH_INTERACT_ROUND_TIMEOUT_SECONDS: {
      name: 'Mech interact round timeout',
      description: '',
      value: '900', // 15 min
      provision_type: EnvProvisionType.FIXED,
    },
  },
} as const;

const AGENTS_FUN_COMMON_TEMPLATE: Pick<
  ServiceTemplate,
  'env_variables' | 'hash' | 'image' | 'description' | 'service_version'
> = {
  hash: 'bafybeiardecju3sygh7hwuywka2bgjinbr7vrzob4mpdrookyfsbdmoq2m',
  image:
    'https://gateway.autonolas.tech/ipfs/QmQYDGMg8m91QQkTWSSmANs5tZwKrmvUCawXZfXVVWQPcu',
  description: `${KPI_DESC_PREFIX} Agents.Fun @twitter_handle`, // NOTE: @twitter_handle to be replaced with twitter username
  service_version: 'v0.8.0-alpha3',
  env_variables: {
    BASE_LEDGER_RPC: {
      name: 'Base ledger RPC',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    CELO_LEDGER_RPC: {
      name: 'Celo ledger RPC',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    TWEEPY_CONSUMER_API_KEY: {
      name: 'Twitter consumer API key',
      description: '',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    TWEEPY_CONSUMER_API_KEY_SECRET: {
      name: 'Twitter consumer API key secret',
      description: '',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    TWEEPY_BEARER_TOKEN: {
      name: 'Twitter bearer token',
      description: '',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    TWEEPY_ACCESS_TOKEN: {
      name: 'Twitter access token',
      description: '',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    TWEEPY_ACCESS_TOKEN_SECRET: {
      name: 'Twitter access token secret',
      description: '',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    GENAI_API_KEY: {
      name: 'Gemini api key',
      description: '',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    FIREWORKS_API_KEY: {
      name: 'Fireworks AI api key',
      description: '',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    PERSONA: {
      name: 'Persona description',
      description: '',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    // These are fixed, but may become user provided in the future
    FEEDBACK_PERIOD_HOURS: {
      name: 'Feedback period',
      description: '',
      value: '1',
      provision_type: EnvProvisionType.FIXED,
    },
    MIN_FEEDBACK_REPLIES: {
      name: 'Minimum feedback replies',
      description: '',
      value: '10',
      provision_type: EnvProvisionType.FIXED,
    },
    RESET_PAUSE_DURATION: {
      name: 'Reset pause duration',
      description: '',
      value: '300',
      provision_type: EnvProvisionType.FIXED,
    },
    STORE_PATH: {
      name: 'Store path',
      description: '',
      value: 'persistent_data/',
      provision_type: EnvProvisionType.COMPUTED,
    },
    STAKING_TOKEN_CONTRACT_ADDRESS: {
      name: 'Staking token contract address',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    ACTIVITY_CHECKER_CONTRACT_ADDRESS: {
      name: 'Staking activity checker contract address',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
  },
} as const;

/**
 * Agents.fun Base template
 */
const AGENTS_FUN_BASE_TEMPLATE: ServiceTemplate = {
  agentType: AgentType.AgentsFun,
  name: 'Agents.Fun',
  home_chain: MiddlewareChain.BASE,
  configurations: {
    [MiddlewareChain.BASE]: {
      staking_program_id: STAKING_PROGRAM_IDS.AgentsFun1, // default, may be overwritten
      nft: 'bafybeiaakdeconw7j5z76fgghfdjmsr6tzejotxcwnvmp3nroaw3glgyve',
      rpc: DEFAULT_RPC, // overwritten
      agent_id: 43,
      threshold: 1,
      use_staking: true,
      cost_of_bond: +parseEther(50),
      monthly_gas_estimate: +parseEther(0.03),
      fund_requirements: {
        [ethers.constants.AddressZero]: {
          agent: +parseEther(0.00625),
          safe: +parseEther(0.0125),
        },
      },
    },
  },
  ...AGENTS_FUN_COMMON_TEMPLATE,
} as const;

// TODO: celo template (check each key)
/**
 * Agents.fun Celo template
 */
export const AGENTS_FUN_CELO_TEMPLATE: ServiceTemplate = {
  agentType: AgentType.AgentsFunCelo,
  name: 'Agents.Fun - Celo',
  home_chain: MiddlewareChain.CELO,
  configurations: {
    [MiddlewareChain.CELO]: {
      staking_program_id: STAKING_PROGRAM_IDS.MemeCeloAlpha2, // default, may be overwritten
      nft: 'bafybeiaakdeconw7j5z76fgghfdjmsr6tzejotxcwnvmp3nroaw3glgyve',
      rpc: DEFAULT_RPC, // overwritten
      agent_id: 43,
      threshold: 1,
      use_staking: true,
      cost_of_bond: +parseEther(50), // TODO: celo
      monthly_gas_estimate: +parseEther(0.03), // TODO: celo
      fund_requirements: {
        [ethers.constants.AddressZero]: {
          agent: +parseEther(0.00625), // TODO: celo
          safe: +parseEther(0.0125), // TODO: celo
        },
      },
    },
  },
  ...AGENTS_FUN_COMMON_TEMPLATE,
} as const;

const BABYDEGEN_COMMON_TEMPLATE: Pick<
  ServiceTemplate,
  'hash' | 'service_version'
> = {
  hash: 'bafybeih7ohx7j5vrrl4kvs5igreh5jlt6tc35o7qho4qdonco27krutxkq',
  service_version: 'v0.3.15',
};

export const MODIUS_SERVICE_TEMPLATE: ServiceTemplate = {
  agentType: AgentType.Modius,
  name: 'Optimus',
  description: `${KPI_DESC_PREFIX} Optimus`,
  image:
    'https://gateway.autonolas.tech/ipfs/bafybeiaakdeconw7j5z76fgghfdjmsr6tzejotxcwnvmp3nroaw3glgyve',
  home_chain: MiddlewareChain.MODE,
  configurations: {
    [MiddlewareChain.MODE]: {
      staking_program_id: STAKING_PROGRAM_IDS.ModiusAlpha, // default, may be overwritten
      nft: 'bafybeiafjcy63arqkfqbtjqpzxyeia2tscpbyradb4zlpzhgc3xymwmmtu',
      rpc: DEFAULT_RPC, // overwritten
      agent_id: 40,
      threshold: 1,
      use_staking: true,
      cost_of_bond: +parseEther(20),
      monthly_gas_estimate: +parseEther(0.011), // TODO: should be 0.0055, temp fix to avoid low balance alerts until the refund is fixed in the middleware
      fund_requirements: {
        [ethers.constants.AddressZero]: {
          agent: +parseEther(0.0005),
          safe: 0,
        },
        [MODE_TOKEN_CONFIG[TokenSymbol.USDC].address as string]: {
          agent: 0,
          safe: +parseUnits(16, MODE_TOKEN_CONFIG[TokenSymbol.USDC].decimals),
        },
      },
    },
  },
  env_variables: {
    MODE_LEDGER_RPC: {
      name: 'Mode ledger RPC',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    SAFE_CONTRACT_ADDRESSES: {
      name: 'Safe contract address',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    TENDERLY_ACCESS_KEY: {
      name: 'Tenderly access key',
      description: '',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    TENDERLY_ACCOUNT_SLUG: {
      name: 'Tenderly account slug',
      description: '',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    TENDERLY_PROJECT_SLUG: {
      name: 'Tenderly project slug',
      description: '',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    STAKING_TOKEN_CONTRACT_ADDRESS: {
      name: 'Staking token contract address',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    COINGECKO_API_KEY: {
      name: 'Coingecko API key',
      description: '',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    GENAI_API_KEY: {
      name: 'Gemini api key',
      description: '',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    STAKING_CHAIN: {
      name: 'Staking chain',
      description: '',
      value: 'mode',
      provision_type: EnvProvisionType.FIXED,
    },
    ACTIVITY_CHECKER_CONTRACT_ADDRESS: {
      name: 'Staking activity checker contract address',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    STAKING_ACTIVITY_CHECKER_CONTRACT_ADDRESS: {
      // Unused, refactored - remove
      name: 'Staking activity checker contract address',
      description: '',
      value: 'Unused',
      provision_type: EnvProvisionType.FIXED,
    },
    MIN_SWAP_AMOUNT_THRESHOLD: {
      name: 'Minimum swap amount threshold',
      description: '',
      value: '15',
      provision_type: EnvProvisionType.FIXED,
    },
    ALLOWED_CHAINS: {
      name: 'Allowed chains',
      description: '',
      value: '["mode"]',
      provision_type: EnvProvisionType.FIXED,
    },
    TARGET_INVESTMENT_CHAINS: {
      name: 'Target investment chains',
      description: '',
      value: '["mode"]',
      provision_type: EnvProvisionType.FIXED,
    },
    INITIAL_ASSETS: {
      name: 'Initial assets',
      description: '',
      value:
        '{"mode":{"0x0000000000000000000000000000000000000000":"ETH","0xd988097fb8612cc24eeC14542bC03424c656005f":"USDC"}}',
      provision_type: EnvProvisionType.FIXED,
    },
    SELECTED_STRATEGIES: {
      name: 'Selected strategies',
      description: '',
      value: '["balancer_pools_search", "asset_lending"]',
      provision_type: EnvProvisionType.FIXED,
    },
    INIT_FALLBACK_GAS: {
      name: 'Init fallback gas',
      description: '',
      value: '250000',
      provision_type: EnvProvisionType.FIXED,
    },
    STORE_PATH: {
      name: 'Store path',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    RESET_PAUSE_DURATION: {
      name: 'Reset pause duration',
      description: '',
      value: '300',
      provision_type: EnvProvisionType.FIXED,
    },
  },
  ...BABYDEGEN_COMMON_TEMPLATE,
} as const;

export const OPTIMUS_SERVICE_TEMPLATE: ServiceTemplate = {
  agentType: AgentType.Optimus,
  name: 'Optimus - Optimism',
  description: `${KPI_DESC_PREFIX} Optimus service deployment on Optimism network`,
  image:
    'https://gateway.autonolas.tech/ipfs/bafybeiaakdeconw7j5z76fgghfdjmsr6tzejotxcwnvmp3nroaw3glgyve',
  home_chain: MiddlewareChain.OPTIMISM,
  configurations: {
    [MiddlewareChain.OPTIMISM]: {
      staking_program_id: STAKING_PROGRAM_IDS.OptimusAlpha, // default, may be overwritten
      nft: 'bafybeiafjcy63arqkfqbtjqpzxyeia2tscpbyradb4zlpzhgc3xymwmmtu',
      rpc: DEFAULT_RPC, // overwritten
      agent_id: 40,
      threshold: 1,
      use_staking: true,
      cost_of_bond: +parseEther(20),
      monthly_gas_estimate: +parseEther(0.011),
      fund_requirements: {
        [ethers.constants.AddressZero]: {
          agent: +parseEther(0.0007),
          safe: 0,
        },
        [OPTIMISM_TOKEN_CONFIG[TokenSymbol.USDC].address as string]: {
          agent: 0,
          safe: +parseUnits(
            16,
            OPTIMISM_TOKEN_CONFIG[TokenSymbol.USDC].decimals,
          ),
        },
      },
    },
  },
  env_variables: {
    OPTIMISM_LEDGER_RPC: {
      name: 'Optimism ledger RPC',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    SAFE_CONTRACT_ADDRESSES: {
      name: 'Safe contract address',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    TENDERLY_ACCESS_KEY: {
      name: 'Tenderly access key',
      description: '',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    TENDERLY_ACCOUNT_SLUG: {
      name: 'Tenderly account slug',
      description: '',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    TENDERLY_PROJECT_SLUG: {
      name: 'Tenderly project slug',
      description: '',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    STAKING_TOKEN_CONTRACT_ADDRESS: {
      name: 'Staking token contract address',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    COINGECKO_API_KEY: {
      name: 'Coingecko API key',
      description: '',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    GENAI_API_KEY: {
      name: 'Gemini API key',
      description: '',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    STAKING_CHAIN: {
      name: 'Staking chain',
      description: '',
      value: 'optimism',
      provision_type: EnvProvisionType.FIXED,
    },
    ACTIVITY_CHECKER_CONTRACT_ADDRESS: {
      name: 'Staking activity checker contract address',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    TARGET_INVESTMENT_CHAINS: {
      name: 'Target investment chains',
      description: '',
      value: '["optimism"]',
      provision_type: EnvProvisionType.FIXED,
    },
    INITIAL_ASSETS: {
      name: 'Initial assets',
      description: '',
      value:
        '{"optimism":{"0x0000000000000000000000000000000000000000":"ETH","0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85":"USDC"}}',
      provision_type: EnvProvisionType.FIXED,
    },
    INIT_FALLBACK_GAS: {
      name: 'Init fallback gas',
      description: '',
      value: '250000',
      provision_type: EnvProvisionType.FIXED,
    },
    STORE_PATH: {
      name: 'Store path',
      description: '',
      value: '',
      provision_type: EnvProvisionType.COMPUTED,
    },
    RESET_PAUSE_DURATION: {
      name: 'Reset pause duration',
      description: '',
      value: '300',
      provision_type: EnvProvisionType.FIXED,
    },
  },
  ...BABYDEGEN_COMMON_TEMPLATE,
} as const;

/**
 * Supafund Service Template
 * A specialized prediction market agent for evaluating startup and crypto project milestones
 */
export const SUPAFUND_SERVICE_TEMPLATE: ServiceTemplate = {
  agentType: AgentType.Supafund,
  name: 'Supafund Agent',
  hash: 'bafybeidavcdl5mex7ykrf4fytngrpgejp3oqdllqrj2uvj6vm4qlkqrklu', // TODO: Replace with actual Supafund service hash
  description: `${KPI_DESC_PREFIX} Predicts whether emerging projects will achieve key milestones, providing detailed AI-powered analysis`,
  image:
    'https://www.supafund.xyz/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flight.71a38e21.png&w=64&q=75', // TODO: Replace with Supafund image
  service_version: 'v0.1.0',
  home_chain: MiddlewareChain.GNOSIS,
  configurations: {
    [MiddlewareChain.GNOSIS]: {
      staking_program_id: STAKING_PROGRAM_IDS.PearlBeta,
      nft: 'bafybeig64atqaladigoc3ds4arltdu63wkdrk3gesjfvnfdmz35amv7faq', // TODO: Replace with Supafund NFT
      rpc: DEFAULT_RPC,
      agent_id: 14, // TODO: Replace with Supafund agent ID
      threshold: 1,
      use_staking: true,
      use_mech_marketplace: false,
      cost_of_bond: +parseEther(0.001),
      monthly_gas_estimate: +parseEther(10),
      fund_requirements: {
        [ethers.constants.AddressZero]: {
          agent: +parseEther(2),
          safe: +parseEther(5),
        },
      },
    },
  },
  env_variables: {
    // Inherit most environment variables from PREDICT_SERVICE_TEMPLATE
    ...PREDICT_SERVICE_TEMPLATE.env_variables,
    // Add Supafund-specific environment variables
    SUPAFUND_WEIGHTS: {
      name: 'Supafund agent weights configuration',
      description:
        'JSON string with weights for: founder_team, market_opportunity, technical_analysis, social_sentiment, tokenomics',
      value:
        '{"founder_team":20,"market_opportunity":20,"technical_analysis":20,"social_sentiment":20,"tokenomics":20}',
      provision_type: EnvProvisionType.USER,
    },
    SUPAFUND_API_ENDPOINT: {
      name: 'Supafund API endpoint',
      description: 'API endpoint for Supafund backend services',
      value: '',
      provision_type: EnvProvisionType.USER,
    },
    SUPAFUND_MARKET_CREATORS: {
      name: 'Supafund market creator addresses',
      description: 'List of addresses that create Supafund prediction markets',
      value: '["0x89c5cc945dd550BcFfb72Fe42BfF002429F46Fec"]', // TODO: Replace with actual Supafund creator addresses
      provision_type: EnvProvisionType.FIXED,
    },
    CREATOR_PER_SUBGRAPH: {
      name: 'Market creators per subgraph',
      description: 'JSON mapping of subgraph names to creator addresses',
      value: '{"omen_subgraph":["0x92F869018B5F954a4197a15feb951CF9260c54a8"]}',
      provision_type: EnvProvisionType.FIXED,
    },
    MIN_EDGE_THRESHOLD: {
      name: 'Minimum edge threshold',
      description: 'Minimum edge percentage required to place a bet',
      value: '5',
      provision_type: EnvProvisionType.USER,
    },
    RISK_TOLERANCE: {
      name: 'Risk tolerance',
      description: 'Risk tolerance level (1-10)',
      value: '5',
      provision_type: EnvProvisionType.USER,
    },
  },
} as const;

export const SERVICE_TEMPLATES: ServiceTemplate[] = [
  PREDICT_SERVICE_TEMPLATE,
  AGENTS_FUN_BASE_TEMPLATE,
  MODIUS_SERVICE_TEMPLATE,
  AGENTS_FUN_CELO_TEMPLATE,
  OPTIMUS_SERVICE_TEMPLATE,
  SUPAFUND_SERVICE_TEMPLATE,
] as const;

export const getServiceTemplates = (): ServiceTemplate[] => SERVICE_TEMPLATES;

export const getServiceTemplate = (
  templateHash: string,
): ServiceTemplate | undefined =>
  SERVICE_TEMPLATES.find((template) => template.hash === templateHash);
