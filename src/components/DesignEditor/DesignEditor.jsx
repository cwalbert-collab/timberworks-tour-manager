import React, { useState, useEffect } from 'react';
import './DesignEditor.css';

// Default CSS variable categories
const CSS_VARIABLE_CATEGORIES = {
  'Primary Colors': [
    { name: '--color-primary', label: 'Primary', type: 'color' },
    { name: '--color-primary-light', label: 'Primary Light', type: 'color' },
    { name: '--color-primary-dark', label: 'Primary Dark', type: 'color' },
  ],
  'Secondary Colors': [
    { name: '--color-secondary', label: 'Secondary', type: 'color' },
    { name: '--color-secondary-light', label: 'Secondary Light', type: 'color' },
  ],
  'Status Colors': [
    { name: '--color-red', label: 'Red/Error', type: 'color' },
    { name: '--color-red-light', label: 'Red Light', type: 'color' },
    { name: '--color-warning', label: 'Warning', type: 'color' },
    { name: '--color-warning-light', label: 'Warning Light', type: 'color' },
  ],
  'Background Colors': [
    { name: '--color-bg', label: 'Background', type: 'color' },
    { name: '--color-bg-tertiary', label: 'Tertiary BG', type: 'color' },
    { name: '--color-bg-hover', label: 'Hover BG', type: 'color' },
    { name: '--card-bg', label: 'Card BG', type: 'color' },
  ],
  'Text Colors': [
    { name: '--color-text', label: 'Text', type: 'color' },
    { name: '--color-text-secondary', label: 'Text Secondary', type: 'color' },
    { name: '--color-text-muted', label: 'Text Muted', type: 'color' },
  ],
  'Border & Header': [
    { name: '--color-border', label: 'Border', type: 'color' },
    { name: '--header-bg', label: 'Header BG', type: 'color' },
  ],
};

// Preset themes
const PRESETS = {
  'Default Light': {
    '--color-primary': '#2e7d32',
    '--color-primary-light': '#e8f5e9',
    '--color-primary-dark': '#1b5e20',
    '--color-secondary': '#1565c0',
    '--color-secondary-light': '#e3f2fd',
    '--color-red': '#c62828',
    '--color-red-light': '#ffebee',
    '--color-warning': '#f57c00',
    '--color-warning-light': '#fff3e0',
    '--color-bg': '#f5f5f5',
    '--color-bg-tertiary': '#f8f9fa',
    '--color-bg-hover': '#e9ecef',
    '--card-bg': '#ffffff',
    '--color-text': '#333333',
    '--color-text-secondary': '#495057',
    '--color-text-muted': '#6c757d',
    '--color-border': '#dee2e6',
    '--header-bg': '#2e7d32',
  },
  'Default Dark': {
    '--color-primary': '#4caf50',
    '--color-primary-light': '#1b3d1c',
    '--color-primary-dark': '#388e3c',
    '--color-secondary': '#42a5f5',
    '--color-secondary-light': '#1a2a3d',
    '--color-red': '#ef5350',
    '--color-red-light': '#3d1a1a',
    '--color-warning': '#ffb74d',
    '--color-warning-light': '#3d2a1a',
    '--color-bg': '#121212',
    '--color-bg-tertiary': '#1e1e1e',
    '--color-bg-hover': '#2d2d2d',
    '--card-bg': '#1e1e1e',
    '--color-text': '#e0e0e0',
    '--color-text-secondary': '#b0b0b0',
    '--color-text-muted': '#808080',
    '--color-border': '#333333',
    '--header-bg': '#1b5e20',
  },
  'Ocean Blue': {
    '--color-primary': '#0277bd',
    '--color-primary-light': '#e1f5fe',
    '--color-primary-dark': '#01579b',
    '--color-secondary': '#00838f',
    '--color-secondary-light': '#e0f7fa',
    '--color-red': '#d32f2f',
    '--color-red-light': '#ffebee',
    '--color-warning': '#ff8f00',
    '--color-warning-light': '#fff8e1',
    '--color-bg': '#eceff1',
    '--color-bg-tertiary': '#f5f5f5',
    '--color-bg-hover': '#e0e0e0',
    '--card-bg': '#ffffff',
    '--color-text': '#263238',
    '--color-text-secondary': '#455a64',
    '--color-text-muted': '#78909c',
    '--color-border': '#cfd8dc',
    '--header-bg': '#0277bd',
  },
  'Warm Sunset': {
    '--color-primary': '#e65100',
    '--color-primary-light': '#fff3e0',
    '--color-primary-dark': '#bf360c',
    '--color-secondary': '#6a1b9a',
    '--color-secondary-light': '#f3e5f5',
    '--color-red': '#c62828',
    '--color-red-light': '#ffebee',
    '--color-warning': '#f9a825',
    '--color-warning-light': '#fffde7',
    '--color-bg': '#fafafa',
    '--color-bg-tertiary': '#fff8e1',
    '--color-bg-hover': '#ffecb3',
    '--card-bg': '#ffffff',
    '--color-text': '#3e2723',
    '--color-text-secondary': '#5d4037',
    '--color-text-muted': '#8d6e63',
    '--color-border': '#d7ccc8',
    '--header-bg': '#e65100',
  },
  'Forest Night': {
    '--color-primary': '#558b2f',
    '--color-primary-light': '#1a2e1a',
    '--color-primary-dark': '#33691e',
    '--color-secondary': '#8d6e63',
    '--color-secondary-light': '#2d2424',
    '--color-red': '#ff5722',
    '--color-red-light': '#3d1a1a',
    '--color-warning': '#ffc107',
    '--color-warning-light': '#3d3a1a',
    '--color-bg': '#0d1a0d',
    '--color-bg-tertiary': '#1a2e1a',
    '--color-bg-hover': '#2d4a2d',
    '--card-bg': '#1a2e1a',
    '--color-text': '#c8e6c9',
    '--color-text-secondary': '#a5d6a7',
    '--color-text-muted': '#81c784',
    '--color-border': '#2e7d32',
    '--header-bg': '#1b5e20',
  },
};

export default function DesignEditor({ isOpen, onClose, position }) {
  const [variables, setVariables] = useState({});
  const [activeCategory, setActiveCategory] = useState('Primary Colors');
  const [selectedPreset, setSelectedPreset] = useState('');

  // Load current CSS variables on mount
  useEffect(() => {
    if (isOpen) {
      loadCurrentVariables();
    }
  }, [isOpen]);

  const loadCurrentVariables = () => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const currentVars = {};

    Object.values(CSS_VARIABLE_CATEGORIES).flat().forEach(({ name }) => {
      currentVars[name] = computedStyle.getPropertyValue(name).trim();
    });

    setVariables(currentVars);
  };

  const handleVariableChange = (varName, value) => {
    setVariables(prev => ({ ...prev, [varName]: value }));
    document.documentElement.style.setProperty(varName, value);
    setSelectedPreset(''); // Clear preset selection when manually editing
  };

  const applyPreset = (presetName) => {
    const preset = PRESETS[presetName];
    if (preset) {
      Object.entries(preset).forEach(([varName, value]) => {
        document.documentElement.style.setProperty(varName, value);
      });
      setVariables(preset);
      setSelectedPreset(presetName);
    }
  };

  const resetToDefault = () => {
    // Remove all inline styles to revert to CSS defaults
    Object.keys(variables).forEach(varName => {
      document.documentElement.style.removeProperty(varName);
    });
    loadCurrentVariables();
    setSelectedPreset('');
  };

  const exportTheme = () => {
    const cssContent = `:root {\n${Object.entries(variables)
      .map(([name, value]) => `  ${name}: ${value};`)
      .join('\n')}\n}`;

    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-theme.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const panelStyle = position ? {
    position: 'fixed',
    top: Math.min(position.y, window.innerHeight - 500),
    left: Math.min(position.x, window.innerWidth - 360),
  } : {};

  return (
    <>
      <div className="design-editor-backdrop" onClick={onClose} />
      <div className="design-editor-panel" style={panelStyle}>
        <div className="design-editor-header">
          <h3>Design Editor</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="design-editor-content">
          {/* Presets Section */}
          <div className="presets-section">
            <label>Theme Presets</label>
            <div className="preset-buttons">
              {Object.keys(PRESETS).map(presetName => (
                <button
                  key={presetName}
                  className={`preset-btn ${selectedPreset === presetName ? 'active' : ''}`}
                  onClick={() => applyPreset(presetName)}
                >
                  {presetName}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs">
            {Object.keys(CSS_VARIABLE_CATEGORIES).map(category => (
              <button
                key={category}
                className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Variable Editors */}
          <div className="variables-list">
            {CSS_VARIABLE_CATEGORIES[activeCategory]?.map(({ name, label, type }) => (
              <div key={name} className="variable-row">
                <label>{label}</label>
                <div className="variable-input-group">
                  {type === 'color' && (
                    <>
                      <input
                        type="color"
                        value={variables[name] || '#000000'}
                        onChange={(e) => handleVariableChange(name, e.target.value)}
                        className="color-picker"
                      />
                      <input
                        type="text"
                        value={variables[name] || ''}
                        onChange={(e) => handleVariableChange(name, e.target.value)}
                        className="color-text"
                        placeholder="#000000"
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="editor-actions">
            <button className="btn-reset" onClick={resetToDefault}>
              Reset
            </button>
            <button className="btn-export" onClick={exportTheme}>
              Export CSS
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
