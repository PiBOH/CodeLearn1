const KEYWORDS: Record<string, string[]> = {
  python: ['def', 'return', 'if', 'elif', 'else', 'for', 'in', 'while', 'import', 'from', 'as', 'class', 'try', 'except', 'with', 'print', 'True', 'False', 'None', 'and', 'or', 'not', 'pass', 'break', 'continue'],
  javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'of', 'in', 'new', 'this', 'class', 'extends', 'import', 'export', 'from', 'try', 'catch', 'async', 'await', 'true', 'false', 'null', 'undefined', 'console', 'log', 'alert', 'document', 'window'],
  java: ['public', 'private', 'protected', 'static', 'void', 'int', 'double', 'boolean', 'char', 'String', 'class', 'interface', 'extends', 'implements', 'return', 'if', 'else', 'for', 'while', 'new', 'this', 'try', 'catch', 'import', 'package', 'final', 'abstract'],
  kotlin: ['fun', 'val', 'var', 'class', 'data', 'return', 'if', 'else', 'for', 'while', 'when', 'in', 'is', 'as', 'null', 'true', 'false', 'import', 'package', 'override', 'open', 'abstract', 'interface', 'object', 'companion', 'lateinit', 'init'],
  swift: ['let', 'var', 'func', 'return', 'if', 'else', 'for', 'while', 'in', 'guard', 'switch', 'case', 'default', 'break', 'continue', 'class', 'struct', 'enum', 'protocol', 'extension', 'import', 'init', 'self', 'nil', 'true', 'false', 'optional', 'try', 'catch'],
  csharp: ['using', 'namespace', 'class', 'struct', 'interface', 'public', 'private', 'protected', 'static', 'void', 'int', 'string', 'bool', 'double', 'var', 'return', 'if', 'else', 'for', 'foreach', 'while', 'new', 'this', 'async', 'await', 'Task', 'List', 'get', 'set', 'null', 'true', 'false'],
  cpp: ['include', 'using', 'namespace', 'class', 'struct', 'public', 'private', 'protected', 'virtual', 'static', 'void', 'int', 'double', 'float', 'char', 'bool', 'string', 'return', 'if', 'else', 'for', 'while', 'new', 'delete', 'const', 'auto', 'true', 'false', 'nullptr', 'std', 'cout', 'endl'],
  c: ['include', 'define', 'void', 'int', 'float', 'double', 'char', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'struct', 'typedef', 'const', 'static', 'extern', 'sizeof', 'NULL', 'printf', 'scanf', 'malloc', 'free'],
  php: ['<?php', 'echo', 'print', 'function', 'return', 'if', 'else', 'elseif', 'for', 'foreach', 'while', 'class', 'public', 'private', 'protected', 'static', 'new', 'this', 'try', 'catch', 'throw', 'array', 'isset', 'unset', 'true', 'false', 'null', 'global', 'require', 'include'],
  html: ['!DOCTYPE', 'html', 'head', 'body', 'title', 'meta', 'link', 'script', 'style', 'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'form', 'input', 'button', 'label', 'select', 'option', 'textarea', 'header', 'nav', 'main', 'article', 'section', 'aside', 'footer'],
};

const TYPES: Record<string, string[]> = {
  python: ['int', 'str', 'float', 'bool', 'list', 'dict', 'tuple', 'set'],
  javascript: ['Number', 'String', 'Boolean', 'Array', 'Object', 'Promise'],
  java: ['int', 'long', 'short', 'byte', 'float', 'double', 'char', 'boolean'],
  kotlin: ['Int', 'String', 'Double', 'Boolean', 'Float', 'Long', 'Any', 'Unit'],
  swift: ['Int', 'String', 'Double', 'Bool', 'Float', 'Array', 'Dictionary'],
  csharp: ['int', 'string', 'bool', 'double', 'float', 'decimal', 'object', 'dynamic'],
  cpp: ['int', 'double', 'float', 'char', 'bool', 'void', 'auto', 'size_t'],
  c: ['int', 'float', 'double', 'char', 'void', 'size_t'],
  php: [],
  html: [],
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// FIX V1.0.2g: Highlight plain text by tokenising on raw text BEFORE escaping HTML.
// Previously, numbers were wrapped first (e.g. <span class="sh-number">1</span>),
// then keyword regexes ran on the resulting HTML string and matched "class" inside
// the generated attribute, producing corrupted output like class="sh-keyword">class=.
// Now we split the raw text into word/number/separator tokens and classify each one
// individually, escaping HTML only at the very last moment.
function highlightPlain(text: string, keywords: string[], types: string[]): string {
  // Match: identifier-like words, numeric literals, or any run of non-word chars.
  const tokenRe = /([A-Za-z_$][A-Za-z0-9_$]*|\d+(?:\.\d+)?|[^A-Za-z0-9_$]+)/g;
  let result = '';
  let match: RegExpExecArray | null;

  while ((match = tokenRe.exec(text)) !== null) {
    const tok = match[0];
    const escaped = escapeHtml(tok);

    if (/^\d+(\.\d+)?$/.test(tok)) {
      result += `<span class="sh-number">${escaped}</span>`;
    } else if (keywords.includes(tok)) {
      result += `<span class="sh-keyword">${escaped}</span>`;
    } else if (types.includes(tok)) {
      result += `<span class="sh-type">${escaped}</span>`;
    } else {
      result += escaped;
    }
  }

  return result;
}

// Splits code into tokens: strings, comments, and plain code segments
// so we only highlight keywords in plain code, never inside strings/comments
function tokenize(code: string, lang: string): Array<{ type: 'plain' | 'string' | 'comment'; value: string }> {
  const tokens: Array<{ type: 'plain' | 'string' | 'comment'; value: string }> = [];
  let i = 0;

  while (i < code.length) {
    // Single-line comment
    if ((lang !== 'python' && lang !== 'html') && code[i] === '/' && code[i + 1] === '/') {
      const end = code.indexOf('\n', i);
      const val = end === -1 ? code.slice(i) : code.slice(i, end);
      tokens.push({ type: 'comment', value: val });
      i += val.length;
      continue;
    }
    if (lang === 'python' && code[i] === '#') {
      const end = code.indexOf('\n', i);
      const val = end === -1 ? code.slice(i) : code.slice(i, end);
      tokens.push({ type: 'comment', value: val });
      i += val.length;
      continue;
    }
    // Multi-line comment
    if (code[i] === '/' && code[i + 1] === '*') {
      const end = code.indexOf('*/', i + 2);
      const val = end === -1 ? code.slice(i) : code.slice(i, end + 2);
      tokens.push({ type: 'comment', value: val });
      i += val.length;
      continue;
    }
    // Strings: double quote
    if (code[i] === '"') {
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === '\\') { j += 2; continue; }
        if (code[j] === '"') { j++; break; }
        j++;
      }
      tokens.push({ type: 'string', value: code.slice(i, j) });
      i = j;
      continue;
    }
    // Strings: single quote
    if (code[i] === "'") {
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === '\\') { j += 2; continue; }
        if (code[j] === "'") { j++; break; }
        j++;
      }
      tokens.push({ type: 'string', value: code.slice(i, j) });
      i = j;
      continue;
    }
    // Template literals (JS)
    if (lang === 'javascript' && code[i] === '`') {
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === '\\') { j += 2; continue; }
        if (code[j] === '`') { j++; break; }
        j++;
      }
      tokens.push({ type: 'string', value: code.slice(i, j) });
      i = j;
      continue;
    }
    // Plain character — accumulate into plain token
    if (tokens.length > 0 && tokens[tokens.length - 1].type === 'plain') {
      tokens[tokens.length - 1].value += code[i];
    } else {
      tokens.push({ type: 'plain', value: code[i] });
    }
    i++;
  }

  return tokens;
}

export function highlightCode(code: string, language: string): string {
  const lang = language.toLowerCase();
  const keywords = KEYWORDS[lang] || [];
  const types = TYPES[lang] || [];

  const tokens = tokenize(code, lang);

  const parts = tokens.map(token => {
    if (token.type === 'comment') {
      return `<span class="sh-comment">${escapeHtml(token.value)}</span>`;
    }
    if (token.type === 'string') {
      return `<span class="sh-string">${escapeHtml(token.value)}</span>`;
    }
    // Plain code: use the fixed highlightPlain that works on raw text
    return highlightPlain(token.value, keywords, types);
  });

  return parts.join('');
}
