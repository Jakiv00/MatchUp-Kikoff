import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native';
import { MapPin, Heart, Info, X, Check, Parking, Home, Grass } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Field {
  id: string;
  name: string;
  type: 'Artificial' | 'Grass' | 'Concrete';
  maxCapacity: string;
  hasStands: boolean;
  hasParking: boolean;
  isIndoor: boolean;
  latitude: number;
  longitude: number;
  liked: boolean;
}

const mockFields: Field[] = [
  {
    id: '1',
    name: 'Central Park Field',
    type: 'Grass',
    maxCapacity: '11v11',
    hasStands: true,
    hasParking: true,
    isIndoor: false,
    latitude: 40.7829,
    longitude: -73.9654,
    liked: false,
  },
  {
    id: '2',
    name: 'Riverside Stadium',
    type: 'Artificial',
    maxCapacity: '11v11',
    hasStands: true,
    hasParking: true,
    isIndoor: false,
    latitude: 40.7589,
    longitude: -73.9851,
    liked: true,
  },
  {
    id: '3',
    name: 'Olympic Sports Center',
    type: 'Artificial',
    maxCapacity: '11v11',
    hasStands: true,
    hasParking: true,
    isIndoor: true,
    latitude: 40.7505,
    longitude: -73.9934,
    liked: false,
  },
  {
    id: '4',
    name: 'University Field',
    type: 'Grass',
    maxCapacity: '7v7',
    hasStands: false,
    hasParking: true,
    isIndoor: false,
    latitude: 40.7282,
    longitude: -73.9942,
    liked: true,
  },
  {
    id: '5',
    name: 'Community Center',
    type: 'Concrete',
    maxCapacity: '5v5',
    hasStands: false,
    hasParking: false,
    isIndoor: true,
    latitude: 40.7614,
    longitude: -73.9776,
    liked: false,
  },
  {
    id: '6',
    name: 'Brooklyn Heights Field',
    type: 'Artificial',
    maxCapacity: '7v7',
    hasStands: false,
    hasParking: true,
    isIndoor: false,
    latitude: 40.6962,
    longitude: -73.9961,
    liked: false,
  },
  {
    id: '7',
    name: 'Queens Soccer Complex',
    type: 'Grass',
    maxCapacity: '11v11',
    hasStands: true,
    hasParking: true,
    isIndoor: false,
    latitude: 40.7282,
    longitude: -73.7949,
    liked: true,
  },
  {
    id: '8',
    name: 'Indoor Sports Arena',
    type: 'Artificial',
    maxCapacity: '5v5',
    hasStands: false,
    hasParking: true,
    isIndoor: true,
    latitude: 40.7505,
    longitude: -73.9857,
    liked: false,
  },
];

export default function FieldsScreen() {
  const [fields, setFields] = useState<Field[]>(mockFields);
  const [showFieldsList, setShowFieldsList] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [fieldDetailsVisible, setFieldDetailsVisible] = useState(false);
  const [selectedMapField, setSelectedMapField] = useState<Field | null>(null);

  const toggleFieldLike = (fieldId: string) => {
    setFields(prev => 
      prev.map(field => 
        field.id === fieldId 
          ? { ...field, liked: !field.liked }
          : field
      )
    );
  };

  const handleFieldInfo = (field: Field) => {
    setSelectedField(field);
    setFieldDetailsVisible(true);
  };

  const handleMapPinPress = (field: Field) => {
    setSelectedMapField(field);
  };

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'Grass':
        return <Grass size={16} color="#10b981" />;
      case 'Artificial':
        return <MapPin size={16} color="#3b82f6" />;
      case 'Concrete':
        return <Home size={16} color="#6b7280" />;
      default:
        return <MapPin size={16} color="#9ca3af" />;
    }
  };

  const getFieldTypeColor = (type: string) => {
    switch (type) {
      case 'Grass':
        return '#10b981';
      case 'Artificial':
        return '#3b82f6';
      case 'Concrete':
        return '#6b7280';
      default:
        return '#9ca3af';
    }
  };

  const renderFieldCard = (field: Field) => (
    <View key={field.id} style={styles.fieldCard}>
      <View style={styles.fieldCardHeader}>
        <View style={styles.fieldNameContainer}>
          <Text style={styles.fieldName}>{field.name}</Text>
          <View style={styles.fieldTypeContainer}>
            {getFieldTypeIcon(field.type)}
            <Text style={[styles.fieldType, { color: getFieldTypeColor(field.type) }]}>
              {field.type}
            </Text>
          </View>
        </View>
        
        <View style={styles.fieldActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleFieldLike(field.id)}
            activeOpacity={0.7}
          >
            <Heart 
              size={20} 
              color={field.liked ? '#ef4444' : '#9ca3af'} 
              fill={field.liked ? '#ef4444' : 'transparent'}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleFieldInfo(field)}
            activeOpacity={0.7}
          >
            <Info size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.fieldDetails}>
        <Text style={styles.fieldCapacity}>Max: {field.maxCapacity}</Text>
        
        <View style={styles.amenitiesContainer}>
          {field.hasStands && (
            <View style={styles.amenityBadge}>
              <Text style={styles.amenityText}>Stands</Text>
            </View>
          )}
          {field.hasParking && (
            <View style={styles.amenityBadge}>
              <Parking size={12} color="#ffffff" />
            </View>
          )}
          {field.isIndoor && (
            <View style={styles.amenityBadge}>
              <Home size={12} color="#ffffff" />
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderMapPin = (field: Field) => {
    const isSelected = selectedMapField?.id === field.id;
    
    return (
      <TouchableOpacity
        key={field.id}
        style={[
          styles.mapPin,
          {
            left: `${((field.longitude + 74.2) / 0.4) * 100}%`,
            top: `${((40.85 - field.latitude) / 0.2) * 100}%`,
            backgroundColor: isSelected ? '#ef4444' : getFieldTypeColor(field.type),
          },
          isSelected && styles.selectedMapPin
        ]}
        onPress={() => handleMapPinPress(field)}
        activeOpacity={0.8}
      >
        <MapPin size={isSelected ? 16 : 12} color="#ffffff" />
      </TouchableOpacity>
    );
  };

  const renderFieldDetailBox = () => {
    if (!selectedMapField) return null;

    return (
      <View style={styles.fieldDetailBox}>
        <View style={styles.detailBoxHeader}>
          <Text style={styles.detailBoxTitle}>{selectedMapField.name}</Text>
          <TouchableOpacity
            style={styles.detailBoxClose}
            onPress={() => setSelectedMapField(null)}
          >
            <X size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.detailBoxContent}>
          <View style={styles.detailBoxRow}>
            {getFieldTypeIcon(selectedMapField.type)}
            <Text style={styles.detailBoxText}>{selectedMapField.type}</Text>
          </View>
          
          <View style={styles.detailBoxRow}>
            <Text style={styles.detailBoxLabel}>Capacity:</Text>
            <Text style={styles.detailBoxText}>{selectedMapField.maxCapacity}</Text>
          </View>
          
          <View style={styles.detailBoxAmenities}>
            {selectedMapField.hasStands && (
              <View style={styles.detailBoxAmenity}>
                <Check size={12} color="#10b981" />
                <Text style={styles.detailBoxAmenityText}>Stands</Text>
              </View>
            )}
            {selectedMapField.hasParking && (
              <View style={styles.detailBoxAmenity}>
                <Check size={12} color="#10b981" />
                <Text style={styles.detailBoxAmenityText}>Parking</Text>
              </View>
            )}
            {selectedMapField.isIndoor && (
              <View style={styles.detailBoxAmenity}>
                <Check size={12} color="#10b981" />
                <Text style={styles.detailBoxAmenityText}>Indoor</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fields</Text>
      
      {/* List All Fields Button */}
      <TouchableOpacity
        style={styles.listAllButton}
        onPress={() => setShowFieldsList(true)}
        activeOpacity={0.8}
      >
        <MapPin size={20} color="#ffffff" />
        <Text style={styles.listAllButtonText}>List All Fields</Text>
      </TouchableOpacity>
      
      {/* Interactive Map */}
      <View style={styles.mapSection}>
        <Text style={styles.sectionTitle}>Fields Near You</Text>
        
        <View style={styles.mapContainer}>
          {/* Mock Map Background */}
          <View style={styles.mapBackground}>
            <View style={styles.mapGrid}>
              {Array.from({ length: 20 }).map((_, i) => (
                <View key={i} style={styles.mapGridLine} />
              ))}
            </View>
            
            {/* Map Pins */}
            {fields.map(renderMapPin)}
            
            {/* Map Labels */}
            <Text style={[styles.mapLabel, { top: '10%', left: '10%' }]}>Manhattan</Text>
            <Text style={[styles.mapLabel, { top: '60%', left: '20%' }]}>Brooklyn</Text>
            <Text style={[styles.mapLabel, { top: '30%', right: '10%' }]}>Queens</Text>
          </View>
        </View>
        
        {/* Field Detail Box */}
        {renderFieldDetailBox()}
      </View>

      {/* Fields List Modal */}
      <Modal
        visible={showFieldsList}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFieldsList(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>All Fields</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowFieldsList(false)}
              >
                <X size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.fieldsScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.fieldsScrollContent}
            >
              {fields.map(renderFieldCard)}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Field Details Modal */}
      <Modal
        visible={fieldDetailsVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFieldDetailsVisible(false)}
      >
        <View style={styles.detailsModalContainer}>
          <View style={styles.detailsModalContent}>
            {selectedField && (
              <>
                <View style={styles.detailsHeader}>
                  <Text style={styles.detailsTitle}>{selectedField.name}</Text>
                  <TouchableOpacity
                    style={styles.detailsCloseButton}
                    onPress={() => setFieldDetailsVisible(false)}
                  >
                    <X size={24} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.detailsContent}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Field Type:</Text>
                    <View style={styles.detailValueContainer}>
                      {getFieldTypeIcon(selectedField.type)}
                      <Text style={[styles.detailValue, { color: getFieldTypeColor(selectedField.type) }]}>
                        {selectedField.type}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Max Player Capacity:</Text>
                    <Text style={styles.detailValue}>{selectedField.maxCapacity}</Text>
                  </View>
                  
                  <View style={styles.amenitiesSection}>
                    <Text style={styles.amenitiesTitle}>Amenities:</Text>
                    
                    <View style={styles.amenityRow}>
                      <Check size={16} color={selectedField.hasStands ? '#10b981' : '#6b7280'} />
                      <Text style={[
                        styles.amenityLabel,
                        { color: selectedField.hasStands ? '#ffffff' : '#9ca3af' }
                      ]}>
                        Has stands
                      </Text>
                    </View>
                    
                    <View style={styles.amenityRow}>
                      <Check size={16} color={selectedField.hasParking ? '#10b981' : '#6b7280'} />
                      <Text style={[
                        styles.amenityLabel,
                        { color: selectedField.hasParking ? '#ffffff' : '#9ca3af' }
                      ]}>
                        Has parking
                      </Text>
                    </View>
                    
                    <View style={styles.amenityRow}>
                      <Check size={16} color={selectedField.isIndoor ? '#10b981' : '#6b7280'} />
                      <Text style={[
                        styles.amenityLabel,
                        { color: selectedField.isIndoor ? '#ffffff' : '#9ca3af' }
                      ]}>
                        Indoor field
                      </Text>
                    </View>
                  </View>
                </View>
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
    flex: 1,
    backgroundColor: '#0f1115',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 24,
  },
  listAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  listAllButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  mapSection: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1d23',
    marginBottom: 16,
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#2a3f47',
    position: 'relative',
    minHeight: 300,
  },
  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mapGridLine: {
    width: '10%',
    height: '10%',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  mapPin: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedMapPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  mapLabel: {
    position: 'absolute',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  fieldDetailBox: {
    backgroundColor: '#1a1d23',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  detailBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailBoxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  detailBoxClose: {
    padding: 4,
  },
  detailBoxContent: {
    gap: 8,
  },
  detailBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailBoxLabel: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  detailBoxText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  detailBoxAmenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  detailBoxAmenity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailBoxAmenityText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1d23',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: SCREEN_HEIGHT * 0.8,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalCloseButton: {
    padding: 4,
  },
  fieldsScrollView: {
    flex: 1,
  },
  fieldsScrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  fieldCard: {
    backgroundColor: '#0f1115',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  fieldCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  fieldNameContainer: {
    flex: 1,
  },
  fieldName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  fieldTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fieldType: {
    fontSize: 14,
    fontWeight: '500',
  },
  fieldActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldCapacity: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  amenityBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  amenityText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  detailsModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  detailsModalContent: {
    backgroundColor: '#1a1d23',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  detailsCloseButton: {
    padding: 4,
  },
  detailsContent: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  amenitiesSection: {
    marginTop: 8,
  },
  amenitiesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  amenityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  amenityLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});