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
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(false);
  const isAnimating = useRef(false);

  useEffect(() => {
    if (visible && !isAnimating.current) {
      setShouldRender(true);
      isAnimating.current = true;

      // Reset values
      opacity.setValue(0);
      translateY.setValue(20);

      // Create parallel animation for smooth transition
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // After showing, wait and then fade out
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0,
              duration: FADE_DURATION,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 20,
              duration: FADE_DURATION,
              useNativeDriver: true,
            }),
          ]).start(() => {
            isAnimating.current = false;
            setShouldRender(false);
            onHide();
          });
        }, VISIBLE_DURATION);
      });
    }
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <Animated.View 
      style={[
        styles.toast,
        {
          opacity,
          transform: [{ translateY }]
        }
      ]}
    > 
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
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default CustomToast;