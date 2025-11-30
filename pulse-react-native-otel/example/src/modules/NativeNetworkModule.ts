import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface NativeNetworkModuleSpec extends TurboModule {
  makeGetRequest(url: string): Promise<{
    status: number;
    body: string;
    headers: Record<string, string[]>;
  }>;
  makePostRequest(
    url: string,
    body: string
  ): Promise<{
    status: number;
    body: string;
    headers: Record<string, string[]>;
  }>;
}

const NativeNetworkModule = TurboModuleRegistry.getEnforcing<NativeNetworkModuleSpec>('NativeNetworkModule')

export default NativeNetworkModule as NativeNetworkModuleSpec | undefined;
