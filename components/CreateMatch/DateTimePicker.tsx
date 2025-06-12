import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface DateTimePickerProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
}

export default function DateTimePicker({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}: DateTimePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Generate available time slots
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM',
  ];
  
  // Simulate unavailable time slots
  const unavailableTimeSlots = ['9:00 AM', '3:00 PM', '7:00 PM'];
  
  const isTimeSlotAvailable = (time: string) => {
    return !unavailableTimeSlots.includes(time);
  };

  // Calendar functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Add empty slots to complete the last week
    const remainingSlots = (7 - (days.length % 7)) % 7;
    for (let i = 0; i < remainingSlots; i++) {
      days.push(null);
    }
    
    return days;
  };
  
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  const isSelectedDate = (date: Date) => {
    return selectedDate && 
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const formatMonth = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  
  const changeMonth = (increment: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Date & Time</Text>
      <Text style={styles.subtitle}>When do you want to play?</Text>
      
      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity 
            onPress={() => changeMonth(-1)}
            style={styles.monthButton}
          >
            <ChevronLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <Text style={styles.monthTitle}>{formatMonth(currentMonth)}</Text>
          
          <TouchableOpacity 
            onPress={() => changeMonth(1)}
            style={styles.monthButton}
          >
            <ChevronRight size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.weekdaysContainer}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <Text key={index} style={styles.weekdayText}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.daysContainer}>
          {generateCalendarDays().map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                day && isSelectedDate(day) && styles.selectedDayButton,
                day && isToday(day) && styles.todayButton,
                day && isPastDate(day) && styles.disabledDayButton,
              ]}
              disabled={!day || isPastDate(day)}
              onPress={() => day && setSelectedDate(day)}
            >
              {day && (
                <View style={styles.dayContent}>
                  <Text
                    style={[
                      styles.dayText,
                      day && isSelectedDate(day) && styles.selectedDayText,
                      day && isToday(day) && styles.todayText,
                      day && isPastDate(day) && styles.disabledDayText,
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                  {isToday(day) && <View style={styles.todayDot} />}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Time Selector */}
      <Text style={styles.timeTitle}>Select a Time</Text>
      
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.timeSlotContainer}
        contentContainerStyle={styles.timeSlotContent}
      >
        {timeSlots.map((time, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.timeSlot,
              selectedTime === time && styles.selectedTimeSlot,
              !isTimeSlotAvailable(time) && styles.unavailableTimeSlot,
            ]}
            onPress={() => isTimeSlotAvailable(time) && setSelectedTime(time)}
            disabled={!isTimeSlotAvailable(time)}
          >
            <Text
              style={[
                styles.timeSlotText,
                selectedTime === time && styles.selectedTimeSlotText,
                !isTimeSlotAvailable(time) && styles.unavailableTimeSlotText,
              ]}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
  calendarContainer: {
    backgroundColor: '#1a1d23',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  weekdaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    color: '#9ca3af',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    width: `${100/7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  dayContent: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedDayButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  todayButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
  },
  disabledDayButton: {
    opacity: 0.5,
  },
  dayText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '400',
  },
  selectedDayText: {
    fontWeight: '600',
  },
  todayText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  disabledDayText: {
    color: '#6b7280',
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3b82f6',
    marginTop: 2,
  },
  timeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  timeSlotContainer: {
    maxHeight: 60,
  },
  timeSlotContent: {
    paddingBottom: 8,
  },
  timeSlot: {
    backgroundColor: '#1a1d23',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 12,
  },
  selectedTimeSlot: {
    backgroundColor: '#3b82f6',
  },
  unavailableTimeSlot: {
    backgroundColor: '#374151',
    opacity: 0.5,
  },
  timeSlotText: {
    color: '#ffffff',
    fontSize: 14,
  },
  selectedTimeSlotText: {
    fontWeight: '700',
  },
  unavailableTimeSlotText: {
    color: '#9ca3af',
  },
});