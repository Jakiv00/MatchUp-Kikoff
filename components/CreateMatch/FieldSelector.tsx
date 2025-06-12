import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Info, MapPin } from 'lucide-react-native';

interface Field {
  id: string;
  name: string;
  distance: string;
  rating: number;
  surface: string;
  capacity: string;
  price: string;
  hasStands: boolean;
}

interface FieldSelectorProps {
  selectedField: Field | null;
  setSelectedField: (field: Field) => void;
}

export default function FieldSelector({ selectedField, setSelectedField }: FieldSelectorProps) {
  const [fields, setFields] = useState<Field[]>([]);
  const [showFieldInfo, setShowFieldInfo] = useState(false);
  const [selectedFieldInfo, setSelectedFieldInfo] = useState<Field | null>(null);

  // Simulate fetching fields data
  useEffect(() => {
    // This would normally be an API call
    const mockFields: Field[] = [
      {
        id: '1',
        name: 'Central Park Field',
        distance: '1.2 miles',
        rating: 4.5,
        surface: 'Natural Grass',
        capacity: '22 players',
        price: '$80 / hour',
        hasStands: true,
      },
      {
        id: '2',
        name: 'Riverside Stadium',
        distance: '2.5 miles',
        rating: 4.8,
        surface: 'Artificial Turf',
        capacity: '22 players',
        price: '$95 / hour',
        hasStands: true,
      },
      {
        id: '3',
        name: 'Olympic Sports Center',
        distance: '3.7 miles',
        rating: 4.2,
        surface: 'Artificial Turf',
        capacity: '22 players',
        price: '$85 / hour',
        hasStands: true,
      },
      {
        id: '4',
        name: 'University Field',
        distance: '4.1 miles',
        rating: 3.9,
        surface: 'Natural Grass',
        capacity: '14 players',
        price: '$65 / hour',
        hasStands: false,
      },
      {
        id: '5',
        name: 'Community Center',
        distance: '1.8 miles',
        rating: 3.7,
        surface: 'Artificial Turf',
        capacity: '14 players',
        price: '$50 / hour',
        hasStands: false,
      },
    ];
    
    setFields(mockFields);
    
    // Set first field as default if none selected
    if (!selectedField && mockFields.length > 0) {
      setSelectedField(mockFields[0]);
    }
  }, []);

  const showFieldDetails = (field: Field) => {
    setSelectedFieldInfo(field);
    setShowFieldInfo(true);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    
    if (halfStar) {
      stars.push('✬');
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push('☆');
    }
    
    return stars.join(' ');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Field</Text>
      <Text style={styles.subtitle}>Choose where you want to play</Text>
      
      <ScrollView style={styles.fieldsContainer}>
        {fields.map((field) => (
          <TouchableOpacity
            key={field.id}
            style={[
              styles.fieldCard,
              selectedField?.id === field.id && styles.selectedFieldCard
            ]}
            onPress={() => setSelectedField(field)}
          >
            <View style={styles.fieldInfo}>
              <Text style={styles.fieldName}>{field.name}</Text>
              <View style={styles.distanceContainer}>
                <MapPin size={14} color="#9ca3af" />
                <Text style={styles.fieldDistance}>{field.distance}</Text>
              </View>
              <Text style={styles.fieldRating}>
                {renderStars(field.rating)} {field.rating.toFixed(1)}
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => showFieldDetails(field)}
            >
              <Info size={20} color="#3b82f6" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Field Info Modal */}
      <Modal
        visible={showFieldInfo}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFieldInfo(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedFieldInfo && (
              <>
                <Text style={styles.modalTitle}>{selectedFieldInfo.name}</Text>
                
                <View style={styles.fieldDetail}>
                  <Text style={styles.fieldDetailLabel}>Rating:</Text>
                  <Text style={styles.fieldDetailValue}>
                    {renderStars(selectedFieldInfo.rating)} ({selectedFieldInfo.rating.toFixed(1)})
                  </Text>
                </View>
                
                <View style={styles.fieldDetail}>
                  <Text style={styles.fieldDetailLabel}>Surface:</Text>
                  <Text style={styles.fieldDetailValue}>{selectedFieldInfo.surface}</Text>
                </View>
                
                <View style={styles.fieldDetail}>
                  <Text style={styles.fieldDetailLabel}>Capacity:</Text>
                  <Text style={styles.fieldDetailValue}>{selectedFieldInfo.capacity}</Text>
                </View>
                
                <View style={styles.fieldDetail}>
                  <Text style={styles.fieldDetailLabel}>Price:</Text>
                  <Text style={styles.fieldDetailValue}>{selectedFieldInfo.price}</Text>
                </View>
                
                <View style={styles.fieldDetail}>
                  <Text style={styles.fieldDetailLabel}>Stands:</Text>
                  <Text style={styles.fieldDetailValue}>
                    {selectedFieldInfo.hasStands ? 'Available' : 'Not available'}
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowFieldInfo(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 24,
  },
  fieldsContainer: {
    flex: 1,
  },
  fieldCard: {
    backgroundColor: '#1a1d23',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedFieldCard: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  fieldInfo: {
    flex: 1,
  },
  fieldName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldDistance: {
    color: '#9ca3af',
    fontSize: 14,
    marginLeft: 4,
  },
  fieldRating: {
    color: '#f59e0b',
    fontSize: 14,
  },
  infoButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1a1d23',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  fieldDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  fieldDetailLabel: {
    fontSize: 16,
    color: '#9ca3af',
  },
  fieldDetailValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});