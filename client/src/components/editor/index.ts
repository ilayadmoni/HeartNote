/**
 * Editor Module Barrel Export
 */

// Main component
export { TemplateEditor } from "./TemplateEditor";

// Desktop & Mobile
export { EditorDesktop } from "./Desktop/EditorDesktop";
export { EditorMobile } from "./Mobile/EditorMobile";

// Sub-components - explicit exports
export { EditorSidebar } from "./components/EditorSidebar";
export { EditorPreview } from "./components/EditorPreview";
export { EditorField } from "./components/EditorField";
export { ColorPicker } from "./components/ColorPicker";
export { SuccessModal } from "./components/SuccessModal";

// Types & Configs
export * from "./types";
export { EDITOR_CONFIGS } from "./configs";

// API
export { createUserPage } from "./api";
