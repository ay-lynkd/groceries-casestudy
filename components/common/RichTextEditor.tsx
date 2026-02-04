import { Text } from "@/components/common";
import { Button } from "@/components/primary";
import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
    Alert,
    Modal,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

interface RichTextEditorProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  maxLength?: number;
  readOnly?: boolean;
}

interface FormattingOption {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: () => void;
  active?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter your content here...",
  minHeight = 150,
  maxHeight = 400,
  maxLength = 5000,
  readOnly = false,
}) => {
  const [showFormatting, setShowFormatting] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const textInputRef = useRef<TextInput>(null);

  const insertFormatting = (formatTag: string, closingTag: string) => {
    const selection = textInputRef.current?.props.selection;
    if (!selection || selection.start === undefined || selection.end === undefined) return;

    const { start, end } = selection;
    const selectedText = value.substring(start, end);
    
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);
    const formattedText = `${beforeText}${formatTag}${selectedText}${closingTag}${afterText}`;
    
    onChange(formattedText);
  };

  const insertLink = () => {
    if (!linkText.trim() || !linkUrl.trim()) {
      Alert.alert("Error", "Please enter both link text and URL");
      return;
    }

    const selection = textInputRef.current?.props.selection;
    if (!selection || selection.start === undefined || selection.end === undefined) return;

    const { start, end } = selection;
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);
    const linkMarkdown = `[${linkText}](${linkUrl})`;
    const formattedText = `${beforeText}${linkMarkdown}${afterText}`;
    
    onChange(formattedText);
    setShowLinkModal(false);
    setLinkText("");
    setLinkUrl("");
  };

  const formattingOptions: FormattingOption[] = [
    {
      id: "bold",
      icon: "text",
      action: () => {
        setIsBold(!isBold);
        insertFormatting("**", "**");
      },
      active: isBold,
    },
    {
      id: "italic",
      icon: "text",
      action: () => {
        setIsItalic(!isItalic);
        insertFormatting("*", "*");
      },
      active: isItalic,
    },
    {
      id: "underline",
      icon: "text",
      action: () => {
        setIsUnderline(!isUnderline);
        // Simple underline using markdown-style (not native underline)
        insertFormatting("__", "__");
      },
      active: isUnderline,
    },
    {
      id: "link",
      icon: "link",
      action: () => setShowLinkModal(true),
    },
    {
      id: "bullet",
      icon: "list",
      action: () => {
        const selection = textInputRef.current?.props.selection;
        if (!selection || selection.start === undefined) return;
        
        const { start } = selection;
        const beforeText = value.substring(0, start);
        const afterText = value.substring(start);
        const bulletText = `${beforeText}\n• `;
        onChange(bulletText + afterText);
      },
    },
    {
      id: "number",
      icon: "list-outline",
      action: () => {
        const selection = textInputRef.current?.props.selection;
        if (!selection || selection.start === undefined) return;
        
        const { start } = selection;
        const beforeText = value.substring(0, start);
        const afterText = value.substring(start);
        const numberText = `${beforeText}\n1. `;
        onChange(numberText + afterText);
      },
    },
    {
      id: "heading1",
      icon: "text",
      action: () => {
        const selection = textInputRef.current?.props.selection;
        if (!selection || selection.start === undefined) return;
        
        const { start } = selection;
        const beforeText = value.substring(0, start);
        const afterText = value.substring(start);
        const headingText = `${beforeText}\n# `;
        onChange(headingText + afterText);
      },
    },
    {
      id: "heading2",
      icon: "text",
      action: () => {
        const selection = textInputRef.current?.props.selection;
        if (!selection || selection.start === undefined) return;
        
        const { start } = selection;
        const beforeText = value.substring(0, start);
        const afterText = value.substring(start);
        const headingText = `${beforeText}\n## `;
        onChange(headingText + afterText);
      },
    },
  ];

  const renderFormattingBar = () => (
    <View style={styles.formattingBar}>
      {formattingOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.formatButton,
            option.active && styles.activeFormatButton,
          ]}
          onPress={option.action}
          disabled={readOnly}
          accessibilityLabel={`${option.id} formatting`}
        >
          <Ionicons
            name={option.icon}
            size={20}
            color={
              option.active
                ? "#FFFFFF"
                : readOnly
                ? theme.colors.text.light
                : theme.colors.text.primary
            }
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPreview = () => {
    // Simple markdown-like preview rendering
    const renderMarkdown = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, (match, content) => `**${content}**`) // Bold
        .replace(/\*(.*?)\*/g, (match, content) => `*${content}*`) // Italic
        .replace(/__(.*?)__/g, (match, content) => `__${content}__`) // Underline
        .replace(/\[(.*?)\]\((.*?)\)/g, (match, text, url) => `${text} (${url})`) // Links
        .replace(/^\s*•\s*(.*?)$/gm, "• $1") // Bullet points
        .replace(/^\s*\d+\.\s*(.*?)$/gm, (match, content) => `1. ${content}`) // Numbered lists
        .replace(/^#\s+(.*?)$/gm, (match, content) => `# ${content}`) // H1
        .replace(/^##\s+(.*?)$/gm, (match, content) => `## ${content}`); // H2
    };

    return (
      <View style={styles.previewContainer}>
        <View style={styles.previewHeader}>
          <Text variant="body" fontWeight="semibold">
            Preview
          </Text>
          <TouchableOpacity onPress={() => setShowFormatting(!showFormatting)}>
            <Ionicons
              name={showFormatting ? "eye-off" : "eye"}
              size={20}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.previewContent}>
          {value ? (
            <Text variant="body">{renderMarkdown(value)}</Text>
          ) : (
            <Text variant="body" color={theme.colors.text.light}>
              Preview will appear here...
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!readOnly && renderFormattingBar()}
      
      <View
        style={[
          styles.editorContainer,
          { minHeight, maxHeight: showFormatting ? maxHeight / 2 : maxHeight },
        ]}
      >
        <TextInput
          ref={textInputRef}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          multiline
          scrollEnabled={true}
          editable={!readOnly}
          maxLength={maxLength}
          style={[
            styles.editor,
            readOnly && styles.readOnlyEditor,
          ]}
          textAlignVertical="top"
          placeholderTextColor={theme.colors.text.light}
        />
        <Text variant="caption" color={theme.colors.text.light} style={styles.charCount}>
          {value.length}/{maxLength}
        </Text>
      </View>

      {showFormatting && renderPreview()}

      {/* Link Modal */}
      <Modal
        visible={showLinkModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLinkModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text variant="h3" fontWeight="bold" style={styles.modalTitle}>
              Insert Link
            </Text>
            
            <View style={styles.inputGroup}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                Link Text
              </Text>
              <TextInput
                value={linkText}
                onChangeText={setLinkText}
                placeholder="Enter link text"
                style={styles.modalInput}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                URL
              </Text>
              <TextInput
                value={linkUrl}
                onChangeText={setLinkUrl}
                placeholder="https://example.com"
                style={styles.modalInput}
                keyboardType="url"
              />
            </View>

            <View style={styles.modalActions}>
              <Button
                variant="outline"
                size="md"
                onPress={() => setShowLinkModal(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onPress={insertLink}
                style={styles.modalButton}
              >
                Insert
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formattingBar: {
    flexDirection: "row",
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    borderTopLeftRadius: theme.borderRadius.md,
    borderTopRightRadius: theme.borderRadius.md,
  },
  formatButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: theme.spacing.xs,
    backgroundColor: theme.colors.background.card,
  },
  activeFormatButton: {
    backgroundColor: theme.colors.primary.green,
  },
  editorContainer: {
    backgroundColor: theme.colors.background.card,
    borderBottomLeftRadius: theme.borderRadius.md,
    borderBottomRightRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  editor: {
    flex: 1,
    fontFamily: theme.fonts.figtree,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    textAlignVertical: "top",
  },
  readOnlyEditor: {
    backgroundColor: theme.colors.background.secondary,
  },
  charCount: {
    alignSelf: "flex-end",
    marginTop: theme.spacing.sm,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    padding: theme.spacing.md,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  previewContent: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    marginBottom: theme.spacing.lg,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    marginBottom: theme.spacing.sm,
  },
  modalInput: {
    fontFamily: theme.fonts.figtree,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  modalActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  modalButton: {
    flex: 1,
  },
});

export default RichTextEditor;