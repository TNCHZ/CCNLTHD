import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export const ShowDatePicker = (currentDate, setDate) => {
  DateTimePickerAndroid.open({
    value: currentDate,
    mode: 'date',
    is24Hour: true,
    onChange: (event, selectedDate) => {
      if (selectedDate) {
        setDate(selectedDate); // Update the date when the user selects one
      }
    },
  });
};