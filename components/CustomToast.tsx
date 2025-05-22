import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface CustomToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
}

const FADE_DURATION = 300;
const VISIBLE_DURATION = 3000;

const CustomToast: React.FC<CustomToastProps> = ({ visible, message, onHide }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (visible && !isAnimating.current) {
      setShouldRender(true);
      isAnimating.current = true;
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
        Animated.delay(VISIBLE_DURATION),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        isAnimating.current = false;
        setShouldRender(false);
        onHide();
      });
    }
    if (!visible) {
      fadeAnim.setValue(0);
      isAnimating.current = false;
      setShouldRender(false);
    }
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <Animated.View style={[styles.toast, { opacity: fadeAnim }]}> 
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 40,
    left: width * 0.1,
    width: width * 0.8,
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    zIndex: 9999,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default CustomToast; 