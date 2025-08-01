/**
 * Supafund Service
 * Note: Since PredictTraderService is abstract, we'll add Supafund-specific
 * static methods here that can be used alongside PredictTraderService
 */
export class SupafundService {
  // Supafund inherits all methods from PredictTraderService
  // Additional Supafund-specific methods can be added here

  /**
   * Validate weights configuration
   */
  static validateWeights = (weights: any): boolean => {
    try {
      if (!weights || typeof weights !== 'object') return false;
      
      const requiredKeys = ['founder_team', 'market_opportunity', 'technical_analysis', 'social_sentiment', 'tokenomics'];
      const hasAllKeys = requiredKeys.every(key => key in weights);
      const allNumbers = Object.values(weights).every(val => typeof val === 'number');
      const totalWeight = Object.values(weights).reduce((sum: number, val: any) => sum + val, 0);
      
      return hasAllKeys && allNumbers && Math.abs(totalWeight - 100) < 0.01;
    } catch {
      return false;
    }
  };

  /**
   * Get Supafund-specific configuration
   */
  static getSupafundConfig = async () => {
    // Try to load from localStorage first (will be replaced with backend)
    const savedConfig = localStorage.getItem('supafund_config');
    if (savedConfig) {
      try {
        return JSON.parse(savedConfig);
      } catch (error) {
        console.error('Failed to parse saved config:', error);
      }
    }

    // Return default configuration
    return {
      weights: {
        founder_team: 20,
        market_opportunity: 20,
        technical_analysis: 20,
        social_sentiment: 20,
        tokenomics: 20,
      },
      minEdgeThreshold: 5,
      riskTolerance: 5,
    };
  };

  /**
   * Update Supafund configuration and sync to service
   */
  static updateSupafundConfig = async (
    config: {
      weights?: {
        founder_team: number;
        market_opportunity: number;
        technical_analysis: number;
        social_sentiment: number;
        tokenomics: number;
      };
      minEdgeThreshold?: number;
      riskTolerance?: number;
      apiEndpoint?: string;
    },
    serviceConfigId?: string
  ) => {
    // Get current config
    const currentConfig = await SupafundService.getSupafundConfig();

    // Update config
    const updatedConfig = {
      ...currentConfig,
      ...config,
    };

    // Save to localStorage (for backward compatibility)
    localStorage.setItem('supafund_config', JSON.stringify(updatedConfig));

    // Update Service env_variables if serviceConfigId is provided
    if (serviceConfigId) {
      const { ServicesService } = await import('@/service/Services');
      
      const envVariables: Record<string, any> = {};

      // Update weights if provided
      if (config.weights) {
        envVariables.SUPAFUND_WEIGHTS = {
          name: 'Supafund agent weights configuration',
          description: 'JSON string with weights for: founder_team, market_opportunity, technical_analysis, social_sentiment, tokenomics',
          value: JSON.stringify(config.weights),
          provision_type: 'USER' as any,
        };
      }

      // Update min edge threshold if provided
      if (config.minEdgeThreshold !== undefined) {
        envVariables.MIN_EDGE_THRESHOLD = {
          name: 'Minimum edge threshold',
          description: 'Minimum edge percentage required to place a bet',
          value: config.minEdgeThreshold.toString(),
          provision_type: 'USER' as any,
        };
      }

      // Update risk tolerance if provided
      if (config.riskTolerance !== undefined) {
        envVariables.RISK_TOLERANCE = {
          name: 'Risk tolerance',
          description: 'Risk tolerance level (1-10)',
          value: config.riskTolerance.toString(),
          provision_type: 'USER' as any,
        };
      }

      // Update API endpoint if provided
      if (config.apiEndpoint !== undefined) {
        envVariables.SUPAFUND_API_ENDPOINT = {
          name: 'Supafund API endpoint',
          description: 'API endpoint for Supafund backend services',
          value: config.apiEndpoint,
          provision_type: 'USER' as any,
        };
      }
      
      await ServicesService.updateService({
        serviceConfigId,
        partialServiceTemplate: {
          env_variables: envVariables
        }
      });
    }

    return updatedConfig;
  };

  /**
   * Update Supafund weights and sync to service (legacy method)
   */
  static updateSupafundWeights = async (
    weights: {
      founder_team: number;
      market_opportunity: number;
      technical_analysis: number;
      social_sentiment: number;
      tokenomics: number;
    },
    serviceConfigId?: string
  ) => {
    return SupafundService.updateSupafundConfig({ weights }, serviceConfigId);
  };

  /**
   * Restart Supafund service to apply new configuration
   */
  static restartSupafundService = async (serviceConfigId: string) => {
    const { ServicesService } = await import('@/service/Services');
    
    try {
      // Stop the service first
      console.log('🛑 Stopping service...');
      await ServicesService.stopDeployment(serviceConfigId);
      
      // Wait longer for the service to fully stop
      console.log('⏳ Waiting for service to stop...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Start the service again
      console.log('🚀 Starting service...');
      await ServicesService.startService(serviceConfigId);
      
      console.log('✅ Service restarted successfully');
    } catch (error) {
      console.error('❌ Service restart failed:', error);
      throw new Error(`Failed to restart service: ${error.message}`);
    }
  };
}
