import { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { colors } from '@expo/styleguide';

enum Status {
  client = 'Client',
  server = 'Server',
}

export default function SwitchHeader() {
  const [isClient, setIsClient] = useState<boolean | undefined>(true);
  // const [isBounce, setIsBounce] = useState<boolean | undefined>(false);
  /* The idea is to use the isBounce to "bounce of the file" from the current device when turned on,
   * sorta like a proxy but with write to Disk for demo purposes
   */
  return (
    <View style={styles.headerContainer}>
      <View style={styles.switchContainer}>
        <Text style={styles.titleText}>{isClient ? Status.client : Status.server}</Text>
        <Switch
          style={styles.switch}
          trackColor={{ false: '#767577', true: colors.primary[200] }}
          // ios_backgroundColor="#3e3e3e"
          onValueChange={(value) => setIsClient(value)}
          value={isClient}
        />
      </View>
      {/* <View style={styles.switchContainer}>
        <Text style={styles.titleText}>Bounce?</Text>
        <Switch
          style={styles.switch}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          onValueChange={(value) => setIsBounce(value)}
          value={isBounce}
        />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginRight: 16,
  },
  switch: {
    height: 40,
    width: 40,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
