import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'ke.safecampus.app',
  appName: 'SafeCampus KE',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
}

export default config
