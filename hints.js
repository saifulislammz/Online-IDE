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
            'ul', 'ol', 'li', 'a', 'link', 'script', 'style',
            // SVG tags for vector graphics
            'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line',
            'polyline', 'polygon', 'text', 'tspan', 'defs', 'use',
            'symbol', 'marker', 'pattern', 'clipPath', 'mask',
            'linearGradient', 'radialGradient', 'stop', 'animate',
            'animateTransform', 'animateMotion', 'foreignObject'
        ],
        // Standard HTML attributes and ARIA attributes
        attributes: [
            'class', 'id', 'style', 'href', 'src', 'alt', 'title',
            'type', 'value', 'placeholder', 'name', 'required',
            'disabled', 'checked', 'selected', 'readonly', 'maxlength',
            'min', 'max', 'pattern', 'target', 'rel', 'download',
            'width', 'height', 'data-*', 'aria-*',
            // SVG attributes for vector graphics
            'viewBox', 'xmlns', 'x', 'y', 'cx', 'cy', 'r', 'rx', 'ry',
            'x1', 'y1', 'x2', 'y2', 'points', 'd', 'fill', 'stroke',
            'stroke-width', 'stroke-linecap', 'stroke-linejoin',
            'stroke-dasharray', 'stroke-dashoffset', 'opacity',
            'fill-opacity', 'stroke-opacity', 'transform', 'gradientUnits',
            'gradientTransform', 'offset', 'stop-color', 'stop-opacity'
        ],
        // SVG and Icons snippets for quick insertion
        snippets: {
            // SVG snippets
            'svg': '<svg width="$1" height="$2" viewBox="0 0 $1 $2" xmlns="http://www.w3.org/2000/svg">\n\t$3\n</svg>',
            'circle': '<circle cx="$1" cy="$2" r="$3" fill="$4" />',
            'rect': '<rect x="$1" y="$2" width="$3" height="$4" fill="$5" />',
            'path': '<path d="$1" fill="$2" stroke="$3" stroke-width="$4" />',
            'line': '<line x1="$1" y1="$2" x2="$3" y2="$4" stroke="$5" stroke-width="$6" />',
            'text': '<text x="$1" y="$2" font-family="$3" font-size="$4" fill="$5">$6</text>',
            'gradient': '<defs>\n\t<linearGradient id="$1" x1="0%" y1="0%" x2="100%" y2="0%">\n\t\t<stop offset="0%" style="stop-color:$2;stop-opacity:1" />\n\t\t<stop offset="100%" style="stop-color:$3;stop-opacity:1" />\n\t</linearGradient>\n</defs>',
            // Font Awesome Icons snippets
            'fa-icon': '<i class="fas fa-$1"></i>',
            'fa-solid': '<i class="fas fa-$1"></i>',
            'fa-regular': '<i class="far fa-$1"></i>',
            'fa-light': '<i class="fal fa-$1"></i>',
            'fa-brands': '<i class="fab fa-$1"></i>',
            // Common Font Awesome icons
            'fa-home': '<i class="fas fa-home"></i>',
            'fa-user': '<i class="fas fa-user"></i>',
            'fa-heart': '<i class="fas fa-heart"></i>',
            'fa-star': '<i class="fas fa-star"></i>',
            'fa-search': '<i class="fas fa-search"></i>',
            'fa-menu': '<i class="fas fa-bars"></i>',
            'fa-close': '<i class="fas fa-times"></i>',
            'fa-check': '<i class="fas fa-check"></i>',
            'fa-arrow-right': '<i class="fas fa-arrow-right"></i>',
            'fa-arrow-left': '<i class="fas fa-arrow-left"></i>'
        }
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

    // XML hints including common tags and attributes
    xml: {
        // Common XML elements and structures
        tags: [
            'root', 'item', 'data', 'config', 'settings', 'entry',
            'record', 'element', 'node', 'value', 'property',
            'metadata', 'header', 'body', 'content', 'description'
        ],
        // Standard XML attributes
        attributes: [
            'id', 'name', 'type', 'value', 'version', 'encoding',
            'xmlns', 'xmlns:xsi', 'xsi:schemaLocation', 'lang',
            'class', 'style', 'title', 'ref', 'key'
        ],
        // XML declarations and common structures
        snippets: {
            'xml': '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n\t$1\n</root>',
            'element': '<$1>$2</$1>',
            'attr': '$1="$2"',
            'comment': '<!-- $1 -->',
            'cdata': '<![CDATA[$1]]>'
        }
    },

    // JSON hints including structure and common patterns
    json: {
        // JSON structure keywords
        keywords: [
            'true', 'false', 'null'
        ],
        // Common JSON property names
        properties: [
            '"name":', '"id":', '"type":', '"value":', '"data":', '"config":',
            '"settings":', '"options":', '"properties":', '"items":',
            '"description":', '"title":', '"url":', '"path":', '"version":',
            '"created":', '"updated":', '"status":', '"enabled":', '"disabled":'
        ],
        // JSON structure snippets
        snippets: {
            'object': '{\n\t"$1": "$2"\n}',
            'array': '[\n\t$1\n]',
            'string': '"$1"',
            'number': '$1',
            'boolean': '$1',
            'null': 'null'
        }
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
 * Registers custom HTML autocompletion with CodeMirror including snippets support
 */
CodeMirror.registerHelper("hint", "html", function(editor) {
    const cursor = editor.getCursor();
    const token = editor.getTokenAt(cursor);
    const start = token.start;
    const end = cursor.ch;
    const line = cursor.line;
    const currentWord = token.string;

    // Combine tags, attributes, and snippets for autocompletion
    const tags = customHints.html.tags.filter(item =>
        item.toLowerCase().startsWith(currentWord.toLowerCase())
    );
    
    const attributes = customHints.html.attributes.filter(item =>
        item.toLowerCase().startsWith(currentWord.toLowerCase())
    );
    
    const snippets = Object.keys(customHints.html.snippets).filter(key =>
        key.toLowerCase().startsWith(currentWord.toLowerCase())
    );

    const list = [
        ...tags.map(item => ({ text: item, displayText: item, type: 'tag' })),
        ...attributes.map(item => ({ text: item, displayText: item, type: 'attribute' })),
        ...snippets.map(key => ({
            text: customHints.html.snippets[key],
            displayText: `${key} (snippet)`,
            type: 'snippet'
        }))
    ];

    return {
        list: list,
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

/**
 * XML Hint Helper
 * Registers custom XML autocompletion with CodeMirror
 * Includes support for tags, attributes, and snippets
 */
CodeMirror.registerHelper("hint", "xml", function(editor) {
    const cursor = editor.getCursor();
    const token = editor.getTokenAt(cursor);
    const start = token.start;
    const end = cursor.ch;
    const line = cursor.line;
    const currentWord = token.string;

    const list = [
        ...customHints.xml.tags,
        ...customHints.xml.attributes,
        ...Object.keys(customHints.xml.snippets)
    ].filter(item =>
        item.toLowerCase().startsWith(currentWord.toLowerCase())
    );

    return {
        list: list.map(item => {
            const isSnippet = customHints.xml.snippets[item];
            return {
                text: isSnippet ? customHints.xml.snippets[item] : item,
                displayText: item + (isSnippet ? ' (snippet)' : '')
            };
        }),
        from: CodeMirror.Pos(line, start),
        to: CodeMirror.Pos(line, end)
    };
});

/**
 * JSON Hint Helper
 * Registers custom JSON autocompletion with CodeMirror
 * Includes support for keywords, properties, and structure snippets
 */
CodeMirror.registerHelper("hint", "json", function(editor) {
    const cursor = editor.getCursor();
    const token = editor.getTokenAt(cursor);
    const start = token.start;
    const end = cursor.ch;
    const line = cursor.line;
    const currentWord = token.string;

    const list = [
        ...customHints.json.keywords,
        ...customHints.json.properties,
        ...Object.keys(customHints.json.snippets)
    ].filter(item =>
        item.toLowerCase().startsWith(currentWord.toLowerCase())
    );

    return {
        list: list.map(item => {
            const isSnippet = customHints.json.snippets[item];
            return {
                text: isSnippet ? customHints.json.snippets[item] : item,
                displayText: item + (isSnippet ? ' (snippet)' : '')
            };
        }),
        from: CodeMirror.Pos(line, start),
        to: CodeMirror.Pos(line, end)
    };
});
