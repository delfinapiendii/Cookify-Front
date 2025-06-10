// components/ModalSelector.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/searchScreenStyles';

interface ModalSelectorProps {
  visible: boolean;
  title: string;
  options: string[];
  highlightedOption?: string;
  onClose: () => void;
  onSelectOption?: (option: string) => void;
}

const ModalSelector: React.FC<ModalSelectorProps> = ({
  visible,
  title,
  options,
  highlightedOption,
  onClose,
  onSelectOption,
}) => {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>

          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.modalOption}
              onPress={() => onSelectOption?.(option)}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  option === highlightedOption && { color: '#FF9A16' },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalSelector;
