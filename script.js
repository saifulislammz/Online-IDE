/**
 * CodeMirror Editor Configuration
 * Base configuration for all editor instances
 */
const editorConfig = {
    lineNumbers: true,
    theme: 'dracula',
    autoCloseTags: true,
    autoCloseBrackets: true,
    lineWrapping: true,
    tabSize: 2,
    indentUnit: 2,
    indentWithTabs: false,
    autofocus: true,
    extraKeys: {
        'Ctrl-Space': 'autocomplete',
        'Tab': function(cm) {
            if (cm.somethingSelected()) {
                cm.indentSelection('add');
            } else {
                cm.replaceSelection(cm.getOption('indentWithTabs') ? '\t' :
                    ' '.repeat(cm.getOption('indentUnit')));
            }
        }
    },
    hintOptions: {
        completeSingle: false,
        closeOnUnfocus: false,
        alignWithWord: true,
        async: true,
        hint: function(editor, options) {
            const cursor = editor.getCursor();
            const token = editor.getTokenAt(cursor);
            const mode = editor.getModeAt(cursor).name;

            // Get hints based on the current mode
            if (mode === 'xml' || mode === 'html') {
                return CodeMirror.hint.html(editor, options);
            } else if (mode === 'css') {
                return CodeMirror.hint.css(editor, options);
            } else if (mode === 'javascript') {
                return CodeMirror.hint.javascript(editor, options);
            }

            // Fallback to word-based hints
            return CodeMirror.hint.anyword(editor, options);
        }
    },
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
};

/**
 * Language-specific configurations
 * Extends base configuration with language-specific settings
 */
const htmlConfig = {
    ...editorConfig,
    mode: 'xml',
    autoCloseTags: true,
    profile: 'html',
    hint: CodeMirror.hint.html,
};

/**
 * CSS specific configuration
 */
const cssConfig = {
    ...editorConfig,
    mode: 'css',
    hint: CodeMirror.hint.css,
};

/**
 * JavaScript specific configuration
 */
const jsConfig = {
    ...editorConfig,
    mode: 'javascript',
    hint: CodeMirror.hint.javascript,
};

// Initialize CodeMirror editors
const htmlEditor = CodeMirror.fromTextArea(document.getElementById('htmlEditor'), htmlConfig);
const cssEditor = CodeMirror.fromTextArea(document.getElementById('cssEditor'), cssConfig);
const jsEditor = CodeMirror.fromTextArea(document.getElementById('jsEditor'), jsConfig);

// Editor Management
/**
 * EditorManager Class
 * Manages the entire editor functionality including:
 * - Editor initialization and switching
 * - Code execution and preview
 * - File operations (save, load, reset)
 * - Error checking and reporting
 */
class EditorManager {
    /**
     * Initialize editor instances and setup required functionality
     */
    constructor() {
        this.editors = {
            html: { instance: htmlEditor, container: document.getElementById('htmlContainer') },
            css: { instance: cssEditor, container: document.getElementById('cssContainer') },
            js: { instance: jsEditor, container: document.getElementById('jsContainer') }
        };
        this.activeEditor = 'html';
        this.setupEventListeners();
        this.setupAutocompletion();
        this.setupColorPicker();
        this.checkForErrors();
    }

    /**
     * Sets up autocompletion triggers for different languages
     * Triggers completion based on specific characters
     */
    setupAutocompletion() {
        // Setup auto-completion triggers
        const triggers = {
            'html': /[<\s]/,
            'css': /[\.\w\-\$]/,
            'javascript': /[\w\.\$]/
        };

        Object.entries(this.editors).forEach(([type, { instance }]) => {
            instance.on('keyup', (cm, event) => {
                const cursor = cm.getCursor();
                const token = cm.getTokenAt(cursor);
                const mode = cm.getModeAt(cursor).name;
                const trigger = triggers[mode];

                // Don't trigger on backspace
                if (event.keyCode === 8) return;

                // Check if we should trigger autocompletion
                if (trigger && trigger.test(token.string)) {
                    CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
                }
            });
        });
    }

    /**
     * Initializes the color picker functionality for CSS editing
     * Allows visual color selection and updates the editor
     */
    setupColorPicker() {
        // Create color picker container
        const colorPickerContainer = document.createElement('div');
        colorPickerContainer.className = 'color-picker-container';
        document.body.appendChild(colorPickerContainer);

        // Initialize Pickr
        const pickr = Pickr.create({
            el: colorPickerContainer,
            theme: 'classic',
            useAsButton: true,
            swatches: [
                '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
                '#ffffff', '#000000', '#808080', '#c0c0c0'
            ],
            components: {
                preview: true,
                opacity: true,
                hue: true,
                interaction: {
                    hex: true,
                    rgba: true,
                    hsla: true,
                    input: true,
                    save: true
                }
            }
        });

        // Handle color selection
        pickr.on('save', (color) => {
            if (!color) return;

            const hexColor = color.toHEXA().toString();
            const cursor = this.editors.css.instance.getCursor();
            const token = this.editors.css.instance.getTokenAt(cursor);

            // Only update if we're in CSS editor and at a color token
            if (this.activeEditor === 'css' && this.isColorToken(token)) {
                const doc = this.editors.css.instance.getDoc();
                const start = { line: cursor.line, ch: token.start };
                const end = { line: cursor.line, ch: token.end };
                doc.replaceRange(hexColor, start, end);
            }

            pickr.hide();
        });

        // Show color picker when clicking on color values in CSS
        this.editors.css.instance.on('mousedown', (cm, e) => {
            const pos = cm.coordsChar({ left: e.pageX, top: e.pageY });
            const token = cm.getTokenAt(pos);

            if (this.isColorToken(token)) {
                const coords = cm.charCoords(pos);
                colorPickerContainer.style.position = 'absolute';
                colorPickerContainer.style.left = `${coords.left}px`;
                colorPickerContainer.style.top = `${coords.bottom + 5}px`;
                pickr.setColor(token.string);
                pickr.show();
            }
        });
    }

    /**
     * Checks if a token represents a color value in CSS
     * @param {Object} token - The token to check
     * @returns {boolean} - True if token is a color value
     */
    isColorToken(token) {
        if (!token) return false;

        // Check if token is a color value
        const isHexColor = /^#([0-9A-Fa-f]{3}){1,2}$/.test(token.string);
        const isNamedColor = /^[a-zA-Z]+$/.test(token.string) && CSS.supports('color', token.string);
        const isRgbColor = /^rgb/.test(token.string) || /^rgba/.test(token.string);
        const isHslColor = /^hsl/.test(token.string) || /^hsla/.test(token.string);

        return token.type === 'atom' || 
               token.type === 'keyword' || 
               token.type === 'variable-2' || 
               isHexColor || 
               isNamedColor || 
               isRgbColor || 
               isHslColor;
    }

    /**
     * Switches between different editor instances (HTML, CSS, JS)
     * @param {string} editorId - The ID of the editor to switch to
     */
    switchEditor(editorId) {
        // Hide all editors and deactivate all tabs
        Object.values(this.editors).forEach(editor => {
            editor.container.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected editor and activate its tab
        this.editors[editorId].container.classList.add('active');
        document.querySelector(`[data-editor="${editorId}"]`).classList.add('active');
        this.activeEditor = editorId;
        this.editors[editorId].instance.refresh();
        this.editors[editorId].instance.focus();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchEditor(tab.dataset.editor);
            });
        });

        // Action buttons
        document.getElementById('runBtn').addEventListener('click', () => this.updatePreview(true));
        document.getElementById('resetBtn').addEventListener('click', () => this.resetCode());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveCode());
        document.getElementById('beautifyBtn').addEventListener('click', () => this.beautifyCode());

        // Preview controls
        document.getElementById('refreshPreview').addEventListener('click', () => this.updatePreview(true));
        document.getElementById('togglePreview').addEventListener('click', () => this.openPreviewInNewTab());

        // Auto-update preview (debounced)
        const debouncedUpdate = debounce(() => this.updatePreview(false), 1000);
        Object.values(this.editors).forEach(({ instance }) => {
            instance.on('change', debouncedUpdate);
        });
    }

    openPreviewInNewTab() {
        const { html, css, js } = this.getValue();
        const content = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>
            /* Reset default styles */
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            /* User CSS */
            ${css}
        </style>
    </head>
    <body>
        ${html}
        <script>
            try {
                // Create a wrapper to catch errors
                (function() {
                    ${js}
                })();
            } catch (error) {
                console.error('JavaScript Error:', error.message);
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = 'position:fixed;bottom:0;left:0;right:0;padding:10px;background:#ff5555;color:white;font-family:monospace;z-index:9999;';
                errorDiv.textContent = 'JavaScript Error: ' + error.message;
                document.body.appendChild(errorDiv);
            }
        </script>
    </body>
</html>`;

        // Create a blob with the content
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        // Open in new tab
        const newTab = window.open(url, '_blank');

        // Clean up the URL object after the new window has loaded
        if (newTab) {
            newTab.onload = () => {
                URL.revokeObjectURL(url);
            };
        }
    }

    updatePreview(forceUpdate = false) {
        const preview = document.getElementById('preview');
        if (!preview) return;

        const { html, css, js } = this.getValue();
        
        // Create a complete HTML document with proper head and body
        const content = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <base target="_blank">
        <style>
            /* Reset default styles */
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            /* User CSS */
            ${css}
        </style>
    </head>
    <body>
        ${html}
        <script>
            window.onerror = function(msg, url, line, col, error) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-display';
                errorDiv.textContent = \`JavaScript Error: \${msg} (Line: \${line})\`;
                document.body.appendChild(errorDiv);
                return false;
            };
            
            try {
                // Create a wrapper to catch errors
                (function() {
                    ${js}
                })();
            } catch (error) {
                console.error('JavaScript Error:', error.message);
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-display';
                errorDiv.textContent = 'JavaScript Error: ' + error.message;
                document.body.appendChild(errorDiv);
            }
        </script>
    </body>
</html>`;

        // Only update if content has changed or force update is requested
        if (forceUpdate || preview.srcdoc !== content) {
            preview.srcdoc = content;
        }
    }

    beautifyCode() {
        const { instance } = this.editors[this.activeEditor];
        let beautifiedCode = '';
        
        const options = {
            indent_size: 4,
            indent_char: ' ',
            max_preserve_newlines: 2,
            preserve_newlines: true,
            keep_array_indentation: false,
            break_chained_methods: false,
            indent_scripts: 'normal',
            brace_style: 'collapse',
            space_before_conditional: true,
            unescape_strings: false,
            jslint_happy: false,
            end_with_newline: false,
            wrap_line_length: 0,
            indent_empty_lines: false
        };

        try {
            switch(this.activeEditor) {
                case 'html':
                    beautifiedCode = html_beautify(instance.getValue(), {
                        ...options,
                        unformatted: ['code', 'pre', 'em', 'strong', 'span']
                    });
                    break;
                case 'css':
                    beautifiedCode = css_beautify(instance.getValue(), options);
                    break;
                case 'js':
                    beautifiedCode = js_beautify(instance.getValue(), {
                        ...options,
                        space_after_anon_function: true,
                        space_after_named_function: true
                    });
                    break;
            }

            // Update editor content
            instance.setValue(beautifiedCode);
            
            // Show success notification
            this.showNotification('Code beautified successfully!', 'success');
        } catch (error) {
            console.error('Beautification error:', error);
            this.showNotification('Failed to beautify code!', 'error');
        }
    }

    getValue() {
        return {
            html: this.editors.html.instance.getValue(),
            css: this.editors.css.instance.getValue(),
            js: this.editors.js.instance.getValue()
        };
    }

    setValue(code) {
        this.editors.html.instance.setValue(code.html || '');
        this.editors.css.instance.setValue(code.css || '');
        this.editors.js.instance.setValue(code.js || '');
        this.updatePreview(); // Update preview after setting values
    }

    saveCode() {
        try {
            const code = this.getValue();
            
            // Save to localStorage for persistence
            localStorage.setItem('savedCode', JSON.stringify(code));
            
            // Track how many files were downloaded
            let downloadedFiles = 0;
            
            // Only download files that have content
            if (code.html.trim()) {
                this.downloadFile('index.html', code.html, 'text/html');
                downloadedFiles++;
            }
            
            if (code.css.trim()) {
                this.downloadFile('styles.css', code.css, 'text/css');
                downloadedFiles++;
            }
            
            if (code.js.trim()) {
                this.downloadFile('script.js', code.js, 'application/javascript');
                downloadedFiles++;
            }
            
            // Show appropriate message based on downloads
            if (downloadedFiles > 0) {
                this.showNotification(`${downloadedFiles} file${downloadedFiles > 1 ? 's' : ''} downloaded successfully!`, 'success');
            } else {
                this.showNotification('No files to download - all editors are empty', 'warning');
            }
        } catch (error) {
            console.error('Save error:', error);
            this.showNotification('Failed to save code: ' + error.message, 'error');
        }
    }

    downloadFile(filename, content, type) {
        // Create a blob with the content
        const blob = new Blob([content], { type: type });
        const url = URL.createObjectURL(blob);
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        // Append link to body, click it, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    loadSavedCode() {
        try {
            const savedCode = localStorage.getItem('savedCode');
            if (savedCode) {
                const code = JSON.parse(savedCode);
                this.setValue(code);
                this.showNotification('Code loaded successfully!', 'success');
            }
        } catch (error) {
            console.error('Load error:', error);
            this.showNotification('Failed to load saved code: ' + error.message, 'error');
        }
    }

    resetCode() {
        if (confirm('Are you sure you want to reset all code? This cannot be undone.')) {
            this.setValue({
                html: '',
                css: '',
                js: ''
            });
            this.updatePreview(true);
            this.showNotification('Code reset successfully!', 'success');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger reflow to ensure animation plays
        notification.offsetHeight;
        
        // Add visible class for animation
        notification.classList.add('visible');
        
        // Remove after animation
        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    checkForErrors() {
        const code = this.getValue();
        let errors = {
            html: [],
            css: [],
            js: []
        };

        // Check HTML errors
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(code.html, 'text/html');
            const htmlErrors = doc.getElementsByTagName('parsererror');
            if (htmlErrors.length) {
                errors.html.push({
                    line: this.getErrorLineNumber(htmlErrors[0].textContent, code.html),
                    message: htmlErrors[0].textContent
                });
            }
        } catch (e) {
            errors.html.push({ line: 1, message: e.message });
        }

        // Check CSS errors
        try {
            const tempStyle = document.createElement('style');
            tempStyle.textContent = code.css;
            document.head.appendChild(tempStyle);
            const cssRules = tempStyle.sheet.cssRules;
            document.head.removeChild(tempStyle);
        } catch (e) {
            const lineMatch = e.message.match(/line (\d+)/);
            const line = lineMatch ? parseInt(lineMatch[1]) : 1;
            errors.css.push({ line, message: e.message });
        }

        // Check JavaScript errors
        try {
            new Function(code.js);
        } catch (e) {
            const lineMatch = e.stack.match(/\<anonymous\>:(\d+)/);
            const line = lineMatch ? parseInt(lineMatch[1]) : 1;
            errors.js.push({ line, message: e.message });
        }

        // Mark errors in editors
        this.markErrors(errors);
        return errors;
    }

    markErrors(errors) {
        // Clear existing error markers
        Object.values(this.editors).forEach(({ instance }) => {
            instance.clearGutter('error-gutter');
            instance.getAllMarks().forEach(mark => mark.clear());
        });

        // Mark HTML errors
        errors.html.forEach(error => {
            this.markEditorError(this.editors.html.instance, error);
        });

        // Mark CSS errors
        errors.css.forEach(error => {
            this.markEditorError(this.editors.css.instance, error);
        });

        // Mark JavaScript errors
        errors.js.forEach(error => {
            this.markEditorError(this.editors.js.instance, error);
        });
    }

    markEditorError(editor, error) {
        // Create error marker in gutter
        const marker = document.createElement('div');
        marker.className = 'error-marker';
        marker.title = error.message;
        marker.innerHTML = '&#x26A0;';
        
        // Add error marker to gutter
        editor.setGutterMarker(error.line - 1, 'error-gutter', marker);
        
        // Highlight error line
        editor.markText(
            { line: error.line - 1, ch: 0 },
            { line: error.line - 1, ch: editor.getLine(error.line - 1).length },
            { className: 'error-line' }
        );
    }

    getErrorLineNumber(errorText, code) {
        const lines = code.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (errorText.includes(lines[i].trim())) {
                return i + 1;
            }
        }
        return 1;
    }

    setupEditor(editorId, mode, value = '') {
        const editor = CodeMirror.fromTextArea(document.getElementById(editorId), {
            mode: mode,
            theme: 'dracula',
            lineNumbers: true,
            autoCloseTags: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: false,
            lineWrapping: true,
            gutters: ['CodeMirror-linenumbers', 'error-gutter'],
            extraKeys: {
                'Ctrl-Space': 'autocomplete',
                'Tab': 'indentMore',
                'Shift-Tab': 'indentLess'
            }
        });

        editor.setValue(value);
        editor.on('change', () => {
            this.checkForErrors();
            this.updatePreview(false);
        });

        return editor;
    }

}

// Initialize Editor Manager
const editorManager = new EditorManager();

// Setup UI Controls
document.getElementById('runBtn').addEventListener('click', () => editorManager.updatePreview());
document.getElementById('saveBtn').addEventListener('click', () => editorManager.saveCode());
document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the editor? All unsaved changes will be lost.')) {
        editorManager.resetCode();
    }
});

// Toggle Preview Panel
document.getElementById('togglePreview').addEventListener('click', () => {
    const previewPanel = document.querySelector('.preview-panel');
    previewPanel.classList.toggle('collapsed');
});

// Auto-update preview (debounced)
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const debouncedUpdate = debounce(() => editorManager.updatePreview(), 500);

// Add event listeners for editor changes
Object.values(editorManager.editors).forEach(editor => {
    editor.instance.on('change', debouncedUpdate);
});

// Load saved code if exists
editorManager.loadSavedCode();