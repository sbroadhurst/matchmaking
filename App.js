import { NavigationContainer } from '@react-navigation/native'
import { TailwindProvider, useTailwind } from 'tailwind-rn'
import { AuthProvider } from './hooks/useAuth'
import StackNavigator from './StackNavigator'
import utilities from './tailwind.json'

export default function App() {
  return (
    <NavigationContainer>
      <TailwindProvider utilities={utilities}>
        <AuthProvider>
          <StackNavigator />
        </AuthProvider>
      </TailwindProvider>
    </NavigationContainer>
  )
}
