/**
 * Custom Hints Configuration for CodeMirror Editor
 * Provides intelligent code completion for HTML, CSS, and JavaScript
 */

// Define comprehensive hint collections for each supported language
const customHints = {
    // HTML hints including common tags and attributes
    html: {
        // Common HTML5 structural and semantic tags
        tags: [
            'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'section', 'article', 'nav', 'header', 'footer', 'main',
            'aside', 'form', 'input', 'button', 'select', 'option',
            'textarea', 'label', 'img', 'video', 'audio', 'source',
            'canvas', 'table', 'tr', 'td', 'th', 'thead', 'tbody',
            'ul', 'ol', 'li', 'a', 'link', 'script', 'style'
        ],
        // Standard HTML attributes and ARIA attributes
        attributes: [
            'class', 'id', 'style', 'href', 'src', 'alt', 'title',
            'type', 'value', 'placeholder', 'name', 'required',
            'disabled', 'checked', 'selected', 'readonly', 'maxlength',
            'min', 'max', 'pattern', 'target', 'rel', 'download',
            'width', 'height', 'data-*', 'aria-*'
        ]
    },

    // CSS hints including properties, values, units, and colors
    css: {
        // Common CSS properties for styling
        properties: [
            'display', 'position', 'top', 'right', 'bottom', 'left',
            'margin', 'padding', 'width', 'height', 'background',
            'color', 'font-size', 'font-weight', 'font-family',
            'border', 'border-radius', 'box-shadow', 'text-align',
            'flex', 'grid', 'transform', 'transition', 'animation',
            'opacity', 'z-index', 'overflow', 'cursor', 'content'
        ],
        // Frequently used CSS property values
        values: [
            'flex', 'grid', 'block', 'inline', 'none', 'hidden',
            'absolute', 'relative', 'fixed', 'sticky', 'auto',
            'center', 'left', 'right', 'justify', 'space-between',
            'cover', 'contain', 'repeat', 'no-repeat', 'pointer',
            'bold', 'normal', 'italic', 'underline', 'uppercase'
        ],
        // CSS measurement units
        units: ['px', 'em', 'rem', '%', 'vh', 'vw', 'deg', 's', 'ms'],
        // Basic color keywords
        colors: [
            'red', 'blue', 'green', 'yellow', 'purple', 'orange',
            'black', 'white', 'gray', 'transparent', 'currentColor'
        ]
    },

    // JavaScript hints including keywords, functions, and code snippets
    javascript: {
        // JavaScript language keywords
        keywords: [
            'function', 'const', 'let', 'var', 'if', 'else', 'for',
            'while', 'do', 'switch', 'case', 'break', 'continue',
            'return', 'try', 'catch', 'finally', 'throw', 'class',
            'extends', 'new', 'this', 'super', 'import', 'export'
        ],
        // Common DOM and built-in JavaScript functions
        functions: [
            'querySelector', 'querySelectorAll', 'getElementById',
            'getElementsByClassName', 'getElementsByTagName',
            'addEventListener', 'removeEventListener', 'setTimeout',
            'setInterval', 'clearTimeout', 'clearInterval', 'fetch',
            'console.log', 'console.error', 'console.warn', 'alert'
        ],
        // Code snippets for common JavaScript patterns
        snippets: {
            'log': 'console.log($1);',
            'ael': 'addEventListener("$1", ($2) => {\n\t$3\n});',
            'fun': 'function $1($2) {\n\t$3\n}',
            'afun': '($1) => {\n\t$2\n}',
            'if': 'if ($1) {\n\t$2\n}',
            'for': 'for (let i = 0; i < $1; i++) {\n\t$2\n}',
            'forin': 'for (const key in $1) {\n\t$2\n}',
            'forof': 'for (const item of $1) {\n\t$2\n}',
            'fetch': 'fetch("$1")\n\t.then(response => response.json())\n\t.then(data => {\n\t\t$2\n\t})\n\t.catch(error => console.error(error));'
        }
    }
};

/**
 * HTML Hint Helper
 * Registers custom HTML autocompletion with CodeMirror
 */
CodeMirror.registerHelper("hint", "html", function(editor) {
    const cursor = editor.getCursor();
    const token = editor.getTokenAt(cursor);
    const start = token.start;
    const end = cursor.ch;
    const line = cursor.line;
    const currentWord = token.string;

    const list = [...customHints.html.tags, ...customHints.html.attributes].filter(item =>
        item.toLowerCase().startsWith(currentWord.toLowerCase())
    );

    return {
        list: list.map(item => ({
            text: item,
            displayText: item
        })),
        from: CodeMirror.Pos(line, start),
        to: CodeMirror.Pos(line, end)
    };
});

/**
 * CSS Hint Helper
 * Registers custom CSS autocompletion with CodeMirror
 */
CodeMirror.registerHelper("hint", "css", function(editor) {
    const cursor = editor.getCursor();
    const token = editor.getTokenAt(cursor);
    const start = token.start;
    const end = cursor.ch;
    const line = cursor.line;
    const currentWord = token.string;

    const list = [
        ...customHints.css.properties,
        ...customHints.css.values,
        ...customHints.css.units,
        ...customHints.css.colors
    ].filter(item =>
        item.toLowerCase().startsWith(currentWord.toLowerCase())
    );

    return {
        list: list.map(item => ({
            text: item,
            displayText: item
        })),
        from: CodeMirror.Pos(line, start),
        to: CodeMirror.Pos(line, end)
    };
});

/**
 * JavaScript Hint Helper
 * Registers custom JavaScript autocompletion with CodeMirror
 * Includes support for snippets and keywords
 */
CodeMirror.registerHelper("hint", "javascript", function(editor) {
    const cursor = editor.getCursor();
    const token = editor.getTokenAt(cursor);
    const start = token.start;
    const end = cursor.ch;
    const line = cursor.line;
    const currentWord = token.string;

    const list = [
        ...customHints.javascript.keywords,
        ...customHints.javascript.functions,
        ...Object.keys(customHints.javascript.snippets)
    ].filter(item =>
        item.toLowerCase().startsWith(currentWord.toLowerCase())
    );

    return {
        list: list.map(item => {
            const isSnippet = customHints.javascript.snippets[item];
            return {
                text: isSnippet ? customHints.javascript.snippets[item] : item,
                displayText: item + (isSnippet ? ' (snippet)' : '')
            };
        }),
        from: CodeMirror.Pos(line, start),
        to: CodeMirror.Pos(line, end)
    };
});
