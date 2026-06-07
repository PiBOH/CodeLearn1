export interface Course {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  icon: string;
  description: string;
  totalLessons: number;
  level: string;
  category: 'web' | 'mobile' | 'systems' | 'general';
}

export const courses: Course[] = [
  { id: 'html', name: 'HTML', color: '#e34c26', bgColor: '#fff5f2', icon: 'FileCode', description: 'Il linguaggio di markup per creare pagine web.', totalLessons: 10, level: 'Principiante', category: 'web' },
  { id: 'javascript', name: 'JavaScript', color: '#fbbf24', bgColor: '#fffbeb', icon: 'Zap', description: 'Il linguaggio del web moderno e interattivo.', totalLessons: 14, level: 'Principiante', category: 'web' },
  { id: 'python', name: 'Python', color: '#f59e0b', bgColor: '#fffbeb', icon: 'Snake', description: 'Il linguaggio più versatile e facile da imparare.', totalLessons: 14, level: 'Principiante', category: 'general' },
  { id: 'php', name: 'PHP', color: '#6366f1', bgColor: '#eef2ff', icon: 'Globe', description: 'Il backend che alimenta milioni di siti web.', totalLessons: 10, level: 'Principiante', category: 'web' },
  { id: 'java', name: 'Java', color: '#ef4444', bgColor: '#fef2f2', icon: 'Coffee', description: 'Robusto, portatile, usato in milioni di dispositivi.', totalLessons: 12, level: 'Intermedio', category: 'general' },
  { id: 'kotlin', name: 'Kotlin', color: '#8b5cf6', bgColor: '#f5f3ff', icon: 'Smartphone', description: 'Il linguaggio moderno per Android.', totalLessons: 10, level: 'Intermedio', category: 'mobile' },
  { id: 'swift', name: 'Swift', color: '#f97316', bgColor: '#fff7ed', icon: 'Apple', description: 'Crea app native per iOS e macOS.', totalLessons: 10, level: 'Intermedio', category: 'mobile' },
  { id: 'csharp', name: 'C#', color: '#10b981', bgColor: '#ecfdf5', icon: 'Gamepad2', description: 'Perfetto per giochi, app desktop e web.', totalLessons: 12, level: 'Intermedio', category: 'general' },
  { id: 'cpp', name: 'C++', color: '#3b82f6', bgColor: '#eff6ff', icon: 'Cpu', description: 'Prestazioni elevate per sistemi e giochi.', totalLessons: 12, level: 'Avanzato', category: 'systems' },
  { id: 'c', name: 'C', color: '#06b6d4', bgColor: '#ecfeff', icon: 'Terminal', description: 'Le fondamenta della programmazione moderna.', totalLessons: 10, level: 'Avanzato', category: 'systems' },
];

export interface CodeExample {
  code: string;
  language: string;
  caption?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  type: 'theory' | 'code' | 'quiz';
  content: string;
  examples?: CodeExample[];
  code?: string;
  expectedOutput?: string;
  quiz?: QuizQuestion[];
  xp: number;
  order: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const lessons: Lesson[] = [
  // ========== HTML ==========
  {
    id: 'html-1', courseId: 'html', title: 'Introduzione a HTML', type: 'theory',
    content: 'HTML (HyperText Markup Language) è il linguaggio di markup usato per creare pagine web. Non è un linguaggio di programmazione, ma un linguaggio di struttura: definisce cosa appare sulla pagina e come è organizzato.\n\nOgni pagina web è composta da elementi HTML racchiusi tra tag. Il browser legge questi tag e li trasforma in contenuto visibile.',
    examples: [
      { code: `<!DOCTYPE html>
<html>
  <head>
    <title>La mia pagina</title>
  </head>
  <body>
    <h1>Ciao, mondo!</h1>
  </body>
</html>`, language: 'html', caption: 'Struttura base' },
    ],
    xp: 10, order: 1
  },
  {
    id: 'html-2', courseId: 'html', title: 'Tag essenziali', type: 'theory',
    content: 'I tag HTML sono le istruzioni che dicono al browser come mostrare il contenuto. Alcuni tag fondamentali sono:\n\n• <h1>...<h6> — Titoli di diversa grandezza\n• <p> — Paragrafo di testo\n• <a href="..."> — Link ipertestuale\n• <img src="..."> — Immagine\n• <ul> / <ol> con <li> — Liste',
    examples: [
      { code: `<h1>Titolo principale</h1>
<h2>Sottotitolo</h2>
<p>Questo è un paragrafo.</p>
<a href="https://example.com">Clicca qui</a>`, language: 'html', caption: 'Testo e link' },
      { code: `<ul>
  <li>Primo elemento</li>
  <li>Secondo elemento</li>
</ul>`, language: 'html', caption: 'Lista' },
    ],
    xp: 15, order: 2
  },
  {
    id: 'html-3', courseId: 'html', title: 'La tua prima pagina', type: 'code',
    content: 'Crea una pagina HTML completa con un titolo <h1> e un paragrafo <p>.',
    examples: [
      { code: `<!DOCTYPE html>
<html>
  <head><title>La mia pagina</title></head>
  <body>
    <h1>Ciao, mondo!</h1>
    <p>Benvenuto!</p>
  </body>
</html>`, language: 'html', caption: 'Esempio' },
    ],
    code: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>La mia pagina</title>\n  </head>\n  <body>\n    <!-- Scrivi qui -->\n  </body>\n</html>', expectedOutput: 'Ciao, mondo!', xp: 20, order: 3
  },
  {
    id: 'html-4', courseId: 'html', title: 'Quiz HTML Base', type: 'quiz',
    content: 'Metti alla prova le tue conoscenze!', xp: 15, order: 4, quiz: [
      { question: 'Quale tag si usa per il titolo principale?', options: ['<title>', '<h1>', '<head>', '<header>'], correct: 1, explanation: '<h1> è il tag per il titolo principale della pagina. <title> appare nella scheda del browser.' },
      { question: 'Quale tag definisce un paragrafo?', options: ['<para>', '<p>', '<text>', '<div>'], correct: 1, explanation: '<p> è il tag standard per i paragrafi in HTML.' },
    ]
  },
  {
    id: 'html-5', courseId: 'html', title: 'Immagini e attributi', type: 'theory',
    content: 'Il tag <img> permette di inserire immagini. Richiede l\'attributo src (source) che indica il percorso dell\'immagine. L\'attributo alt fornisce un testo alternativo per l\'accessibilità.\n\nAltri attributi comuni sono width, height, class e id.',
    examples: [
      { code: `<img src="foto.jpg" alt="Una bella foto" width="300">`, language: 'html', caption: 'Immagine con attributi' },
      { code: `<a href="https://example.com" target="_blank">Apri in nuova scheda</a>`, language: 'html', caption: 'Link con target' },
    ],
    xp: 15, order: 5
  },
  {
    id: 'html-6', courseId: 'html', title: 'Form e input', type: 'theory',
    content: 'I form permettono agli utenti di inserire dati. Il tag <form> racchiude gli elementi di input. I tag <input> possono essere di diversi tipi: text, email, password, checkbox, radio, submit.',
    examples: [
      { code: `<form action="/invia" method="POST">
  <label for="nome">Nome:</label>
  <input type="text" id="nome" name="nome">
  <input type="submit" value="Invia">
</form>`, language: 'html', caption: 'Form base' },
    ],
    xp: 15, order: 6
  },
  {
    id: 'html-7', courseId: 'html', title: 'Tabelle', type: 'code',
    content: 'Crea una tabella HTML con 2 righe e 2 colonne usando <table>, <tr> e <td>.',
    examples: [
      { code: `<table>
  <tr>
    <td>A1</td>
    <td>A2</td>
  </tr>
  <tr>
    <td>B1</td>
    <td>B2</td>
  </tr>
</table>`, language: 'html', caption: 'Esempio' },
    ],
    code: '<!-- Crea una tabella 2x2 -->\n', expectedOutput: 'A1', xp: 20, order: 7
  },
  {
    id: 'html-8', courseId: 'html', title: 'Quiz HTML Avanzato', type: 'quiz',
    content: 'Quiz su form e tabelle!', xp: 20, order: 8, quiz: [
      { question: 'Quale attributo di <img> specifica il percorso?', options: ['href', 'src', 'path', 'url'], correct: 1, explanation: 'src (source) indica il percorso dell\'immagine.' },
      { question: 'Quale tag crea una riga di tabella?', options: ['<row>', '<tr>', '<td>', '<line>'], correct: 1, explanation: '<tr> (table row) definisce una riga in una tabella HTML.' },
    ]
  },
  {
    id: 'html-9', courseId: 'html', title: 'Semantic HTML', type: 'theory',
    content: 'HTML5 introduce tag semantici che descrivono il significato del contenuto: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>.\n\nUsare tag semantici migliora l\'accessibilità e il SEO del sito.',
    examples: [
      { code: `<header>
  <h1>Il mio blog</h1>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>
<main>
  <article>
    <h2>Titolo articolo</h2>
    <p>Contenuto...</p>
  </article>
</main>
<footer>
  <p>© 2024</p>
</footer>`, language: 'html', caption: 'Struttura semantica' },
    ],
    xp: 15, order: 9
  },
  {
    id: 'html-10', courseId: 'html', title: 'Progetto: Pagina Portfolio', type: 'code',
    content: 'Crea una pagina portfolio con header, una sezione "Chi sono" con h2 e p, e un footer.',
    examples: [
      { code: `<!DOCTYPE html>
<html>
<head><title>Portfolio</title></head>
<body>
  <header><h1>Mario Rossi</h1></header>
  <section>
    <h2>Chi sono</h2>
    <p>Sono uno sviluppatore web.</p>
  </section>
  <footer><p>© 2024</p></footer>
</body>
</html>`, language: 'html', caption: 'Esempio' },
    ],
    code: '<!DOCTYPE html>\n<html>\n<head><title>Portfolio</title></head>\n<body>\n  <!-- Scrivi qui -->\n</body>\n</html>', expectedOutput: 'Chi sono', xp: 25, order: 10
  },

  // ========== JAVASCRIPT ==========
  {
    id: 'js-1', courseId: 'javascript', title: 'Introduzione a JS', type: 'theory',
    content: 'JavaScript è il linguaggio di scripting del web. Viene eseguito nel browser e permette di creare pagine interattive. È anche usato sul server con Node.js.',
    examples: [
      { code: `let nome = "Mario";
console.log("Ciao " + nome);`, language: 'javascript', caption: 'Variabile e console' },
      { code: `const btn = document.querySelector("button");
btn.addEventListener("click", () => {
    alert("Cliccato!");
});`, language: 'javascript', caption: 'Interattività' },
    ],
    xp: 10, order: 1
  },
  {
    id: 'js-2', courseId: 'javascript', title: 'Variabili in JS', type: 'theory',
    content: 'In JavaScript moderno si usano let e const per dichiarare variabili. let permette la riassegnazione, const crea costanti.',
    examples: [
      { code: `let contatore = 0;
contatore = contatore + 1;

const PI = 3.14159;
// PI = 3;  // Errore!`, language: 'javascript', caption: 'let vs const' },
    ],
    xp: 15, order: 2
  },
  {
    id: 'js-3', courseId: 'javascript', title: 'Hello JS', type: 'code',
    content: 'Usa console.log() per stampare "Hello JS!"',
    examples: [
      { code: `console.log("Hello JS!");`, language: 'javascript', caption: 'Esempio' },
    ],
    code: '// Scrivi il tuo codice qui\n', expectedOutput: 'Hello JS!', xp: 20, order: 3
  },
  {
    id: 'js-4', courseId: 'javascript', title: 'Quiz JS Base', type: 'quiz',
    content: 'Testa le tue basi!', xp: 15, order: 4, quiz: [
      { question: 'Quale dichiarazione è consigliata per costanti?', options: ['var', 'let', 'const', 'static'], correct: 2, explanation: 'const crea variabili il cui valore non può essere riassegnato.' },
      { question: 'Dove viene eseguito principalmente JS?', options: ['Solo server', 'Solo browser', 'Browser e server', 'Solo database'], correct: 2, explanation: 'JS nasce nel browser ma con Node.js gira anche sul server.' },
    ]
  },
  {
    id: 'js-5', courseId: 'javascript', title: 'Funzioni Arrow', type: 'theory',
    content: 'Le arrow functions offrono una sintassi compatta per scrivere funzioni.',
    examples: [
      { code: `const somma = (a, b) => a + b;
console.log(somma(2, 3));`, language: 'javascript', caption: 'Arrow function' },
      { code: `const numeri = [1, 2, 3];
const doppi = numeri.map(n => n * 2);
console.log(doppi);`, language: 'javascript', caption: 'Con array map' },
    ],
    xp: 15, order: 5
  },
  {
    id: 'js-6', courseId: 'javascript', title: 'Array e Metodi', type: 'code',
    content: 'Crea un array [1,2,3] e stampa la sua lunghezza con .length',
    examples: [
      { code: `const numeri = [1, 2, 3];
console.log(numeri.length);`, language: 'javascript', caption: 'Esempio' },
    ],
    code: '// Scrivi il tuo codice qui\n', expectedOutput: '3', xp: 20, order: 6
  },
  {
    id: 'js-7', courseId: 'javascript', title: 'Oggetti in JS', type: 'theory',
    content: 'Gli oggetti in JavaScript sono collezioni di coppie chiave-valore. Si possono accedere con la notazione a punto o con le parentesi quadre.',
    examples: [
      { code: `const persona = {
  nome: "Anna",
  età: 30,
  città: "Roma"
};
console.log(persona.nome);
console.log(persona["età"]);`, language: 'javascript', caption: 'Oggetto base' },
      { code: `persona.email = "anna@email.com";
console.log(persona);`, language: 'javascript', caption: 'Aggiungere proprietà' },
    ],
    xp: 15, order: 7
  },
  {
    id: 'js-8', courseId: 'javascript', title: 'If e Operatori', type: 'code',
    content: 'Scrivi un if che stampa "maggiore" se x è maggiore di 10. Definisci x = 15.',
    examples: [
      { code: `let x = 15;
if (x > 10) {
  console.log("maggiore");
}`, language: 'javascript', caption: 'Esempio' },
    ],
    code: '// Scrivi qui\n', expectedOutput: 'maggiore', xp: 20, order: 8
  },
  {
    id: 'js-9', courseId: 'javascript', title: 'Ciclo For', type: 'theory',
    content: 'Il ciclo for in JavaScript permette di ripetere un blocco di codice un numero specifico di volte.',
    examples: [
      { code: `for (let i = 1; i <= 5; i++) {
  console.log(i);
}`, language: 'javascript', caption: 'Ciclo for base' },
      { code: `const frutta = ["mela", "banana", "pera"];
for (let f of frutta) {
  console.log(f);
}`, language: 'javascript', caption: 'For...of' },
    ],
    xp: 15, order: 9
  },
  {
    id: 'js-10', courseId: 'javascript', title: 'Quiz JS Intermedio', type: 'quiz',
    content: 'Quiz sugli oggetti e i cicli!', xp: 20, order: 10, quiz: [
      { question: 'Come si accede alla proprietà "nome" di un oggetto obj?', options: ['obj->nome', 'obj.nome', 'obj::nome', 'obj[nome]'], correct: 1, explanation: 'La notazione a punto (obj.nome) è il modo standard.' },
      { question: 'Quale ciclo è ideale per iterare un array?', options: ['for...in', 'for...of', 'while', 'do...while'], correct: 1, explanation: 'for...of itera direttamente sui valori dell\'array.' },
    ]
  },
  {
    id: 'js-11', courseId: 'javascript', title: 'DOM Manipulation', type: 'theory',
    content: 'Il DOM (Document Object Model) è la rappresentazione ad albero della pagina HTML. JavaScript può modificare il DOM per cambiare il contenuto, gli stili e gestire eventi.',
    examples: [
      { code: `const titolo = document.getElementById("titolo");
titolo.textContent = "Nuovo titolo!";
titolo.style.color = "red";`, language: 'javascript', caption: 'Modificare elementi' },
    ],
    xp: 15, order: 11
  },
  {
    id: 'js-12', courseId: 'javascript', title: 'Fetch API', type: 'theory',
    content: 'La Fetch API permette di fare richieste HTTP asincrone. Restituisce una Promise che si risolve con la risposta del server.',
    examples: [
      { code: `fetch("https://api.example.com/dati")
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`, language: 'javascript', caption: 'Fetch base' },
    ],
    xp: 15, order: 12
  },
  {
    id: 'js-13', courseId: 'javascript', title: 'Progetto: To-Do List', type: 'code',
    content: 'Crea un array con 3 task e stampali uno per uno con un ciclo for.',
    examples: [
      { code: `const tasks = ["Studiare", "Allenarsi", "Leggere"];
for (let t of tasks) {
  console.log(t);
}`, language: 'javascript', caption: 'Esempio' },
    ],
    code: '// Crea un array tasks e stampa ogni elemento\n', expectedOutput: 'Studiare', xp: 25, order: 13
  },
  {
    id: 'js-14', courseId: 'javascript', title: 'Quiz JS Avanzato', type: 'quiz',
    content: 'Quiz finale JavaScript!', xp: 25, order: 14, quiz: [
      { question: 'Cosa restituisce fetch()?', options: ['Un oggetto', 'Una Promise', 'Un array', 'Un numero'], correct: 1, explanation: 'fetch() restituisce una Promise che risolve la risposta HTTP.' },
      { question: 'Quale metodo ottiene un elemento per ID?', options: ['querySelector', 'getElementById', 'findElement', 'selectId'], correct: 1, explanation: 'getElementById è il metodo specifico per selezionare per ID.' },
    ]
  },

  // ========== PYTHON ==========
  {
    id: 'py-1', courseId: 'python', title: 'Introduzione a Python', type: 'theory',
    content: 'Python è un linguaggio ad alto livello, interpretato e orientato agli oggetti. È noto per la sua sintassi semplice e leggibile.',
    examples: [
      { code: `nome = "Mario"
età = 25
print("Ciao,", nome)`, language: 'python', caption: 'Variabili e print' },
    ],
    xp: 10, order: 1
  },
  {
    id: 'py-2', courseId: 'python', title: 'Variabili e Tipi', type: 'theory',
    content: 'In Python non devi dichiarare il tipo. I tipi principali sono: int, float, str, bool, list, dict.',
    examples: [
      { code: `x = 10
pi = 3.14
nome = "Anna"
print(type(x))`, language: 'python', caption: 'Tipi' },
    ],
    xp: 15, order: 2
  },
  {
    id: 'py-3', courseId: 'python', title: 'Hello Python', type: 'code',
    content: 'Stampa "Ciao, Mondo!" con print().',
    examples: [
      { code: `print("Ciao, Mondo!")`, language: 'python', caption: 'Esempio' },
    ],
    code: '# Scrivi qui\n', expectedOutput: 'Ciao, Mondo!', xp: 20, order: 3
  },
  {
    id: 'py-4', courseId: 'python', title: 'Quiz Python Base', type: 'quiz',
    content: 'Testa le basi!', xp: 15, order: 4, quiz: [
      { question: 'Quale funzione stampa in Python?', options: ['echo()', 'print()', 'console.log()', 'printf()'], correct: 1, explanation: 'print() è la funzione built-in per stampare in Python.' },
      { question: 'Come si crea una lista?', options: ['[]', '{}', '()', '<>'], correct: 0, explanation: 'Le liste si creano con le parentesi quadre [].' },
    ]
  },
  {
    id: 'py-5', courseId: 'python', title: 'If e Else', type: 'theory',
    content: 'Le istruzioni condizionali in Python usano if, elif ed else. L\'indentazione è fondamentale!',
    examples: [
      { code: `età = 18
if età >= 18:
    print("Maggiorenne")
elif età >= 16:
    print("Quasi")
else:
    print("Minorenne")`, language: 'python', caption: 'If/elif/else' },
    ],
    xp: 15, order: 5
  },
  {
    id: 'py-6', courseId: 'python', title: 'Ciclo For', type: 'code',
    content: 'Stampa i numeri da 1 a 5 con un ciclo for.',
    examples: [
      { code: `for i in range(1, 6):
    print(i)`, language: 'python', caption: 'Esempio' },
    ],
    code: '# Scrivi qui\n', expectedOutput: '1\n2\n3\n4\n5', xp: 20, order: 6
  },
  {
    id: 'py-7', courseId: 'python', title: 'Funzioni', type: 'theory',
    content: 'Le funzioni si definiscono con def. Possono accettare parametri e restituire valori con return.',
    examples: [
      { code: `def saluta(nome):
    return "Ciao, " + nome + "!"
print(saluta("Luca"))`, language: 'python', caption: 'Funzione' },
    ],
    xp: 15, order: 7
  },
  {
    id: 'py-8', courseId: 'python', title: 'Liste e Dizionari', type: 'theory',
    content: 'Le liste sono sequenze ordinate e modificabili. I dizionari sono collezioni di coppie chiave-valore.',
    examples: [
      { code: `frutta = ["mela", "banana", "pera"]
print(frutta[0])
frutta.append("uva")`, language: 'python', caption: 'Liste' },
      { code: `persona = {"nome": "Mario", "età": 25}
print(persona["nome"])`, language: 'python', caption: 'Dizionari' },
    ],
    xp: 15, order: 8
  },
  {
    id: 'py-9', courseId: 'python', title: 'Progetto: Calcolatrice', type: 'code',
    content: 'Crea una funzione somma(a, b) che restituisce la somma e stampa il risultato di somma(3, 4).',
    examples: [
      { code: `def somma(a, b):
    return a + b
print(somma(3, 4))`, language: 'python', caption: 'Esempio' },
    ],
    code: '# Scrivi qui\n', expectedOutput: '7', xp: 25, order: 9
  },
  {
    id: 'py-10', courseId: 'python', title: 'Quiz Python Intermedio', type: 'quiz',
    content: 'Quiz su liste e funzioni!', xp: 20, order: 10, quiz: [
      { question: 'Quale metodo aggiunge un elemento a una lista?', options: ['add()', 'append()', 'push()', 'insert()'], correct: 1, explanation: 'append() aggiunge un elemento alla fine della lista.' },
      { question: 'Come si accede al valore con chiave "nome" in un dict?', options: ['dict.nome', 'dict["nome"]', 'dict->nome', 'dict.get(nome)'], correct: 1, explanation: 'In Python si usano le parentesi quadre per accedere ai dizionari.' },
    ]
  },
  {
    id: 'py-11', courseId: 'python', title: 'Comprensioni di Lista', type: 'theory',
    content: 'Le list comprehension offrono un modo conciso per creare liste basate su liste esistenti.',
    examples: [
      { code: `numeri = [1, 2, 3, 4, 5]
quadrati = [n**2 for n in numeri]
print(quadrati)`, language: 'python', caption: 'List comprehension' },
    ],
    xp: 15, order: 11
  },
  {
    id: 'py-12', courseId: 'python', title: 'Gestione File', type: 'theory',
    content: 'Python semplifica la lettura e scrittura di file con la sintassi with open().',
    examples: [
      { code: `with open("file.txt", "r") as f:
    contenuto = f.read()
    print(contenuto)`, language: 'python', caption: 'Leggere un file' },
    ],
    xp: 15, order: 12
  },
  {
    id: 'py-13', courseId: 'python', title: 'Progetto: Conta Vocali', type: 'code',
    content: 'Scrivi una funzione che conta le vocali in una stringa. Testa con "hello".',
    examples: [
      { code: `def conta_vocali(s):
    return sum(1 for c in s if c in "aeiouAEIOU")
print(conta_vocali("hello"))`, language: 'python', caption: 'Esempio' },
    ],
    code: '# Scrivi qui\n', expectedOutput: '2', xp: 25, order: 13
  },
  {
    id: 'py-14', courseId: 'python', title: 'Quiz Python Avanzato', type: 'quiz',
    content: 'Quiz finale Python!', xp: 25, order: 14, quiz: [
      { question: 'Cosa fa [x**2 for x in range(3)]?', options: ['[0,1,4]', '[1,4,9]', '[0,1,2]', '[2,4,6]'], correct: 0, explanation: 'range(3) genera 0,1,2. Il quadrato di 0 è 0, di 1 è 1, di 2 è 4.' },
      { question: 'Quale parola chiave gestisce le eccezioni?', options: ['catch', 'except', 'error', 'handle'], correct: 1, explanation: 'In Python si usa try/except per gestire le eccezioni.' },
    ]
  },

  // ========== JAVA ==========
  {
    id: 'java-1', courseId: 'java', title: 'Introduzione a Java', type: 'theory',
    content: 'Java è un linguaggio compilato che gira sulla JVM. È orientato agli oggetti e molto usato in ambito enterprise e Android.',
    examples: [
      { code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Java!");
    }
}`, language: 'java', caption: 'Struttura base' },
    ],
    xp: 10, order: 1
  },
  {
    id: 'java-2', courseId: 'java', title: 'Hello World Java', type: 'code',
    content: 'Scrivi un programma Java che stampa "Hello Java!".',
    examples: [
      { code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Java!");
    }
}`, language: 'java', caption: 'Esempio' },
    ],
    code: 'public class Main {\n    public static void main(String[] args) {\n        // Scrivi qui\n    }\n}', expectedOutput: 'Hello Java!', xp: 25, order: 2
  },
  {
    id: 'java-3', courseId: 'java', title: 'Tipi Primitivi', type: 'theory',
    content: 'Java ha 8 tipi primitivi: int, long, short, byte, float, double, char, boolean.',
    examples: [
      { code: `int numero = 42;
double prezzo = 19.99;
boolean attivo = true;
System.out.println(numero);`, language: 'java', caption: 'Tipi primitivi' },
    ],
    xp: 15, order: 3
  },
  {
    id: 'java-4', courseId: 'java', title: 'Quiz Java', type: 'quiz',
    content: 'Verifica le tue conoscenze!', xp: 15, order: 4, quiz: [
      { question: 'Su cosa gira il codice Java compilato?', options: ['CPU diretta', 'JVM', 'Browser', 'Python VM'], correct: 1, explanation: 'Java gira sulla Java Virtual Machine (JVM), rendendolo portatile.' },
      { question: 'Quale metodo è il punto di ingresso?', options: ['start()', 'run()', 'main()', 'init()'], correct: 2, explanation: 'public static void main(String[] args) è il metodo principale.' },
    ]
  },
  {
    id: 'java-5', courseId: 'java', title: 'Classi e Oggetti', type: 'theory',
    content: 'Java è orientato agli oggetti. Una classe è un modello per creare oggetti con proprietà e metodi.',
    examples: [
      { code: `public class Persona {
    String nome;
    int età;

    void saluta() {
        System.out.println("Ciao, " + nome);
    }
}`, language: 'java', caption: 'Classe Persona' },
    ],
    xp: 15, order: 5
  },
  {
    id: 'java-6', courseId: 'java', title: 'Costruttori', type: 'code',
    content: 'Crea una classe Auto con un costruttore che stampa "Auto creata!".',
    examples: [
      { code: `public class Auto {
    public Auto() {
        System.out.println("Auto creata!");
    }
    public static void main(String[] args) {
        Auto a = new Auto();
    }
}`, language: 'java', caption: 'Esempio' },
    ],
    code: 'public class Auto {\n    // Scrivi qui\n    public static void main(String[] args) {\n        Auto a = new Auto();\n    }\n}', expectedOutput: 'Auto creata!', xp: 25, order: 6
  },
  {
    id: 'java-7', courseId: 'java', title: 'Array in Java', type: 'theory',
    content: 'Gli array in Java hanno dimensione fissa e tipo omogeneo. Si dichiarano con il tipo seguito da [].',
    examples: [
      { code: `int[] numeri = {1, 2, 3, 4, 5};
System.out.println(numeri[0]);
System.out.println(numeri.length);`, language: 'java', caption: 'Array' },
    ],
    xp: 15, order: 7
  },
  {
    id: 'java-8', courseId: 'java', title: 'Ciclo For', type: 'code',
    content: 'Scrivi un ciclo for che stampa i numeri da 1 a 3.',
    examples: [
      { code: `for (int i = 1; i <= 3; i++) {
    System.out.println(i);
}`, language: 'java', caption: 'Esempio' },
    ],
    code: '// Scrivi qui\n', expectedOutput: '1\n2\n3', xp: 20, order: 8
  },
  {
    id: 'java-9', courseId: 'java', title: 'Quiz Java Intermedio', type: 'quiz',
    content: 'Quiz su classi e array!', xp: 20, order: 9, quiz: [
      { question: 'Quale parola chiave crea un nuovo oggetto?', options: ['create', 'new', 'make', 'instance'], correct: 1, explanation: 'new è la parola chiave per istanziare un oggetto in Java.' },
      { question: 'Come si ottiene la lunghezza di un array arr?', options: ['arr.size()', 'arr.length', 'arr.count()', 'arr.getLength()'], correct: 1, explanation: 'Gli array in Java hanno la proprietà length (senza parentesi).' },
    ]
  },
  {
    id: 'java-10', courseId: 'java', title: 'Ereditarietà', type: 'theory',
    content: 'L\'ereditarietà permette a una classe di ereditare proprietà e metodi da un\'altra classe usando extends.',
    examples: [
      { code: `class Animale {
    void mangia() { System.out.println("Mangio"); }
}
class Cane extends Animale {
    void abbaia() { System.out.println("Bau!"); }
}`, language: 'java', caption: 'Ereditarietà' },
    ],
    xp: 15, order: 10
  },
  {
    id: 'java-11', courseId: 'java', title: 'Interfacce', type: 'theory',
    content: 'Le interfacce definiscono un contratto che le classi devono rispettare. Una classe può implementare multiple interfacce.',
    examples: [
      { code: `interface Suonabile {
    void suona();
}
class Chitarra implements Suonabile {
    public void suona() {
        System.out.println("Strum!");
    }
}`, language: 'java', caption: 'Interfaccia' },
    ],
    xp: 15, order: 11
  },
  {
    id: 'java-12', courseId: 'java', title: 'Progetto: Calcolatrice OOP', type: 'code',
    content: 'Crea una classe Calcolatrice con un metodo somma(int a, int b) che stampa il risultato.',
    examples: [
      { code: `public class Calcolatrice {
    int somma(int a, int b) {
        return a + b;
    }
    public static void main(String[] args) {
        Calcolatrice c = new Calcolatrice();
        System.out.println(c.somma(5, 3));
    }
}`, language: 'java', caption: 'Esempio' },
    ],
    code: 'public class Calcolatrice {\n    // Scrivi qui\n    public static void main(String[] args) {\n        Calcolatrice c = new Calcolatrice();\n        System.out.println(c.somma(5, 3));\n    }\n}', expectedOutput: '8', xp: 25, order: 12
  },

  // ========== KOTLIN ==========
  {
    id: 'kt-1', courseId: 'kotlin', title: 'Perché Kotlin?', type: 'theory',
    content: 'Kotlin è il linguaggio preferito per Android moderno. È conciso, sicuro (null-safety) e interopera con Java.',
    examples: [
      { code: `val nome = "Mario"
var età = 25
println("Ciao, $nome!")`, language: 'kotlin', caption: 'Val, var e template' },
    ],
    xp: 10, order: 1
  },
  {
    id: 'kt-2', courseId: 'kotlin', title: 'Val e Var', type: 'theory',
    content: 'val dichiara costanti (immutabili), var dichiara variabili mutabili. Il tipo può essere inferito.',
    examples: [
      { code: `val messaggio = "Ciao"
var contatore = 0
contatore++`, language: 'kotlin', caption: 'Val vs Var' },
    ],
    xp: 15, order: 2
  },
  {
    id: 'kt-3', courseId: 'kotlin', title: 'Hello Kotlin', type: 'code',
    content: 'Scrivi una funzione main che stampa "Ciao Kotlin!"',
    examples: [
      { code: `fun main() {
    println("Ciao Kotlin!")
}`, language: 'kotlin', caption: 'Esempio' },
    ],
    code: 'fun main() {\n    // Scrivi qui\n}', expectedOutput: 'Ciao Kotlin!', xp: 20, order: 3
  },
  {
    id: 'kt-4', courseId: 'kotlin', title: 'Quiz Kotlin', type: 'quiz',
    content: 'Testa le basi!', xp: 15, order: 4, quiz: [
      { question: 'Quale keyword dichiara una costante?', options: ['const', 'val', 'let', 'final'], correct: 1, explanation: 'val crea variabili immutabili in Kotlin.' },
      { question: 'Come si interpola una variabile in una stringa?', options: ['$var', '#{var}', '%var%', '{var}'], correct: 0, explanation: 'Kotlin usa $nomeVariabile per l\'interpolazione di stringhe.' },
    ]
  },
  {
    id: 'kt-5', courseId: 'kotlin', title: 'Funzioni', type: 'theory',
    content: 'Le funzioni in Kotlin possono avere parametri con valori di default e restituire valori con tipo esplicito o inferito.',
    examples: [
      { code: `fun saluta(nome: String = "Mondo"): String {
    return "Ciao, $nome!"
}
println(saluta())
println(saluta("Anna"))`, language: 'kotlin', caption: 'Funzione con default' },
    ],
    xp: 15, order: 5
  },
  {
    id: 'kt-6', courseId: 'kotlin', title: 'Null Safety', type: 'theory',
    content: 'Kotlin distingue tra variabili nullable (String?) e non-nullable (String). Questo previene i NullPointerException a compile-time.',
    examples: [
      { code: `var nome: String = "Mario"
// nome = null  // Errore!

var cognome: String? = "Rossi"
cognome = null  // OK`, language: 'kotlin', caption: 'Null safety' },
    ],
    xp: 15, order: 6
  },
  {
    id: 'kt-7', courseId: 'kotlin', title: 'Liste e Collezioni', type: 'code',
    content: 'Crea una lista di numeri e stampa il primo elemento.',
    examples: [
      { code: `val numeri = listOf(10, 20, 30)
println(numeri[0])`, language: 'kotlin', caption: 'Esempio' },
    ],
    code: '// Scrivi qui\n', expectedOutput: '10', xp: 20, order: 7
  },
  {
    id: 'kt-8', courseId: 'kotlin', title: 'Classi e Data Class', type: 'theory',
    content: 'Le data class in Kotlin generano automaticamente equals, hashCode, toString e copy.',
    examples: [
      { code: `data class Utente(val nome: String, val età: Int)
val u = Utente("Mario", 25)
println(u.nome)`, language: 'kotlin', caption: 'Data class' },
    ],
    xp: 15, order: 8
  },
  {
    id: 'kt-9', courseId: 'kotlin', title: 'Quiz Kotlin Intermedio', type: 'quiz',
    content: 'Quiz su funzioni e null safety!', xp: 20, order: 9, quiz: [
      { question: 'Quale tipo accetta null?', options: ['String', 'String!', 'String?', 'String*'], correct: 2, explanation: 'Il punto interrogativo (?) rende un tipo nullable in Kotlin.' },
      { question: 'Cosa genera una data class automaticamente?', options: ['Solo toString', 'equals, hashCode, toString', 'Solo constructor', 'Niente'], correct: 1, explanation: 'Le data class generano automaticamente equals, hashCode, toString e copy.' },
    ]
  },
  {
    id: 'kt-10', courseId: 'kotlin', title: 'Progetto: Utente', type: 'code',
    content: 'Crea una data class Persona con nome e età, istanziala e stampa il nome.',
    examples: [
      { code: `data class Persona(val nome: String, val età: Int)
fun main() {
    val p = Persona("Luca", 30)
    println(p.nome)
}`, language: 'kotlin', caption: 'Esempio' },
    ],
    code: '// Scrivi qui\n', expectedOutput: 'Luca', xp: 25, order: 10
  },

  // ========== SWIFT ==========
  {
    id: 'sw-1', courseId: 'swift', title: 'Introduzione a Swift', type: 'theory',
    content: 'Swift è il linguaggio creato da Apple per iOS, macOS, watchOS e tvOS. È sicuro, veloce e moderno.',
    examples: [
      { code: `let nome = "Mario"
var età = 25
print("Ciao, \\(nome)!")`, language: 'swift', caption: 'Costanti e interpolazione' },
    ],
    xp: 10, order: 1
  },
  {
    id: 'sw-2', courseId: 'swift', title: 'Costanti e Variabili', type: 'theory',
    content: 'let per le costanti, var per le variabili. Il tipo è inferito ma può essere annotato.',
    examples: [
      { code: `let pi: Double = 3.14159
var contatore = 0
contatore += 1`, language: 'swift', caption: 'let e var' },
    ],
    xp: 15, order: 2
  },
  {
    id: 'sw-3', courseId: 'swift', title: 'Hello Swift', type: 'code',
    content: 'Stampa "Hello Swift!" usando print()',
    examples: [
      { code: `print("Hello Swift!")`, language: 'swift', caption: 'Esempio' },
    ],
    code: '// Scrivi il tuo codice qui\n', expectedOutput: 'Hello Swift!', xp: 20, order: 3
  },
  {
    id: 'sw-4', courseId: 'swift', title: 'Quiz Swift', type: 'quiz',
    content: 'Testa le basi!', xp: 15, order: 4, quiz: [
      { question: 'Quale keyword dichiara una costante?', options: ['const', 'let', 'val', 'final'], correct: 1, explanation: 'let dichiara costanti in Swift.' },
      { question: 'Come si interpola in Swift?', options: ['$var', '\\(var)', '#{var}', '%var%'], correct: 1, explanation: 'Swift usa \\(variabile) per l\'interpolazione.' },
    ]
  },
  {
    id: 'sw-5', courseId: 'swift', title: 'Optional', type: 'theory',
    content: 'Gli Optional in Swift rappresentano valori che possono essere assenti. Si dichiarano con ? e si svolgono con ! o guard.',
    examples: [
      { code: `var nome: String? = "Mario"
nome = nil

if let n = nome {
    print(n)
} else {
    print("Nessun nome")
}`, language: 'swift', caption: 'Optional binding' },
    ],
    xp: 15, order: 5
  },
  {
    id: 'sw-6', courseId: 'swift', title: 'Array e Dizionari', type: 'code',
    content: 'Crea un array con i numeri [1,2,3] e stampa il primo elemento.',
    examples: [
      { code: `let numeri = [1, 2, 3]
print(numeri[0])`, language: 'swift', caption: 'Esempio' },
    ],
    code: '// Scrivi qui\n', expectedOutput: '1', xp: 20, order: 6
  },
  {
    id: 'sw-7', courseId: 'swift', title: 'Funzioni', type: 'theory',
    content: 'Le funzioni in Swift possono avere parametri con etichette esterne e interne, valori di default e possono restituire tuple.',
    examples: [
      { code: `func saluta(nome: String) -> String {
    return "Ciao, \\(nome)!"
}
print(saluta(nome: "Anna"))`, language: 'swift', caption: 'Funzione' },
    ],
    xp: 15, order: 7
  },
  {
    id: 'sw-8', courseId: 'swift', title: 'Struct vs Class', type: 'theory',
    content: 'Le struct sono tipi valore (copiati), le classi sono tipi riferimento (condivisi). Le struct sono preferite per dati semplici.',
    examples: [
      { code: `struct Punto {
    var x: Double
    var y: Double
}
let p = Punto(x: 3.0, y: 4.0)
print(p.x)`, language: 'swift', caption: 'Struct' },
    ],
    xp: 15, order: 8
  },
  {
    id: 'sw-9', courseId: 'swift', title: 'Quiz Swift Intermedio', type: 'quiz',
    content: 'Quiz su Optional e Struct!', xp: 20, order: 9, quiz: [
      { question: 'Cosa rappresenta String?', options: ['Una stringa opzionale', 'Una stringa non opzionale', 'Un array', 'Un numero'], correct: 1, explanation: 'String senza ? è non opzionale e deve sempre avere un valore.' },
      { question: 'Le struct sono tipi...', options: ['riferimento', 'valore', 'puntatore', 'classe'], correct: 1, explanation: 'Le struct in Swift sono tipi valore: vengono copiate quando assegnate.' },
    ]
  },
  {
    id: 'sw-10', courseId: 'swift', title: 'Progetto: Rettangolo', type: 'code',
    content: 'Crea una struct Rettangolo con larghezza e altezza, e una funzione area() che stampa l\'area.',
    examples: [
      { code: `struct Rettangolo {
    var larghezza: Double
    var altezza: Double
    func area() -> Double {
        return larghezza * altezza
    }
}
let r = Rettangolo(larghezza: 5, altezza: 3)
print(r.area())`, language: 'swift', caption: 'Esempio' },
    ],
    code: '// Scrivi qui\n', expectedOutput: '15.0', xp: 25, order: 10
  },

  // ========== C# ==========
  {
    id: 'cs-1', courseId: 'csharp', title: 'C# e .NET', type: 'theory',
    content: 'C# è un linguaggio moderno sviluppato da Microsoft. Si usa con .NET per creare app web, desktop, mobile e giochi con Unity.',
    examples: [
      { code: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello C#!");
    }
}`, language: 'csharp', caption: 'Struttura base' },
    ],
    xp: 10, order: 1
  },
  {
    id: 'cs-2', courseId: 'csharp', title: 'Hello C#', type: 'code',
    content: 'Scrivi un programma C# che stampa "Hello C#!"',
    examples: [
      { code: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello C#!");
    }
}`, language: 'csharp', caption: 'Esempio' },
    ],
    code: 'using System;\n\nclass Program {\n    static void Main() {\n        // Scrivi qui\n    }\n}', expectedOutput: 'Hello C#!', xp: 25, order: 2
  },
  {
    id: 'cs-3', courseId: 'csharp', title: 'Variabili e Tipi', type: 'theory',
    content: 'C# è fortemente tipizzato. Usa var per l\'inferenza di tipo o dichiara esplicitamente il tipo.',
    examples: [
      { code: `int età = 25;
var nome = "Mario";
bool attivo = true;
Console.WriteLine($"{nome} ha {età} anni");`, language: 'csharp', caption: 'Variabili e interpolazione' },
    ],
    xp: 15, order: 3
  },
  {
    id: 'cs-4', courseId: 'csharp', title: 'Quiz C#', type: 'quiz',
    content: 'Testa le basi!', xp: 15, order: 4, quiz: [
      { question: 'Quale parola chiave permette l\'inferenza di tipo?', options: ['auto', 'var', 'let', 'dynamic'], correct: 1, explanation: 'var permette al compilatore di inferire il tipo dalla parte destra dell\'assegnazione.' },
      { question: 'Come si interpolano variabili in C#?', options: ['$"{var}"', '"#{var}"', '"%var%"', '"$var"'], correct: 0, explanation: 'C# usa la sintassi $"{variabile}" per l\'interpolazione di stringhe.' },
    ]
  },
  {
    id: 'cs-5', courseId: 'csharp', title: 'Classi e Proprietà', type: 'theory',
    content: 'Le classi in C# possono avere proprietà auto-implementate con get e set.',
    examples: [
      { code: `class Persona {
    public string Nome { get; set; }
    public int Età { get; set; }
}

var p = new Persona { Nome = "Mario", Età = 25 };
Console.WriteLine(p.Nome);`, language: 'csharp', caption: 'Proprietà auto' },
    ],
    xp: 15, order: 5
  },
  {
    id: 'cs-6', courseId: 'csharp', title: 'List e LINQ', type: 'theory',
    content: 'Le List<T> sono liste generiche tipizzate. LINQ permette di interrogare collezioni in modo dichiarativo.',
    examples: [
      { code: `var numeri = new List<int> { 1, 2, 3, 4, 5 };
var pari = numeri.Where(n => n % 2 == 0);
foreach (var n in pari) Console.WriteLine(n);`, language: 'csharp', caption: 'LINQ' },
    ],
    xp: 15, order: 6
  },
  {
    id: 'cs-7', courseId: 'csharp', title: 'If e Cicli', type: 'code',
    content: 'Scrivi un ciclo for che stampa i numeri da 1 a 3.',
    examples: [
      { code: `for (int i = 1; i <= 3; i++) {
    Console.WriteLine(i);
}`, language: 'csharp', caption: 'Esempio' },
    ],
    code: '// Scrivi qui\n', expectedOutput: '1\n2\n3', xp: 20, order: 7
  },
  {
    id: 'cs-8', courseId: 'csharp', title: 'Quiz C# Intermedio', type: 'quiz',
    content: 'Quiz su classi e LINQ!', xp: 20, order: 8, quiz: [
      { question: 'Cosa è List<T>?', options: ['Un array', 'Una lista generica', 'Un dizionario', 'Una pila'], correct: 1, explanation: 'List<T> è una lista generica tipizzata in C#.' },
      { question: 'Quale namespace contiene LINQ?', options: ['System.Data', 'System.Linq', 'System.Collections', 'System.Net'], correct: 1, explanation: 'LINQ è nel namespace System.Linq.' },
    ]
  },
  {
    id: 'cs-9', courseId: 'csharp', title: 'Async/Await', type: 'theory',
    content: 'C# supporta la programmazione asincrona con async e await, semplificando le operazioni I/O.',
    examples: [
      { code: `async Task<string> ScaricaDati() {
    var client = new HttpClient();
    return await client.GetStringAsync("https://api.example.com");
}`, language: 'csharp', caption: 'Async/Await' },
    ],
    xp: 15, order: 9
  },
  {
    id: 'cs-10', courseId: 'csharp', title: 'Progetto: Calcolatrice', type: 'code',
    content: 'Crea una classe Calcolatrice con metodo Somma(int a, int b) e stampa il risultato.',
    examples: [
      { code: `class Calcolatrice {
    public int Somma(int a, int b) => a + b;
}
class Program {
    static void Main() {
        var c = new Calcolatrice();
        Console.WriteLine(c.Somma(5, 3));
    }
}`, language: 'csharp', caption: 'Esempio' },
    ],
    code: 'using System;\n\nclass Calcolatrice {\n    // Scrivi qui\n}\n\nclass Program {\n    static void Main() {\n        var c = new Calcolatrice();\n        Console.WriteLine(c.Somma(5, 3));\n    }\n}', expectedOutput: '8', xp: 25, order: 10
  },
  {
    id: 'cs-11', courseId: 'csharp', title: 'Quiz C# Avanzato', type: 'quiz',
    content: 'Quiz finale C#!', xp: 20, order: 11, quiz: [
      { question: 'Cosa restituisce un metodo async?', options: ['void', 'Task', 'int', 'string'], correct: 1, explanation: 'Un metodo async restituisce un Task (o Task<T> se ha un valore di ritorno).' },
      { question: 'Quale sintassi è una expression-bodied member?', options: ['=>', '->', '::', '=>='], correct: 0, explanation: '=> è usato per expression-bodied members in C#.' },
    ]
  },
  {
    id: 'cs-12', courseId: 'csharp', title: 'Progetto: To-Do Console', type: 'code',
    content: 'Crea una List<string> con 3 task e stampa il primo.',
    examples: [
      { code: `using System;
using System.Collections.Generic;

class Program {
    static void Main() {
        var tasks = new List<string> { "Studiare", "Allenarsi", "Leggere" };
        Console.WriteLine(tasks[0]);
    }
}`, language: 'csharp', caption: 'Esempio' },
    ],
    code: 'using System;\nusing System.Collections.Generic;\n\nclass Program {\n    static void Main() {\n        // Scrivi qui\n    }\n}', expectedOutput: 'Studiare', xp: 25, order: 12
  },

  // ========== C++ ==========
  {
    id: 'cpp-1', courseId: 'cpp', title: 'Il potere di C++', type: 'theory',
    content: 'C++ offre controllo a basso livello della memoria insieme a potenti astrazioni ad oggetti. È usato per giochi, motori grafici e sistemi operativi.',
    examples: [
      { code: `#include <iostream>

int main() {
    std::cout << "Hello C++!" << std::endl;
    return 0;
}`, language: 'cpp', caption: 'Programma base' },
    ],
    xp: 10, order: 1
  },
  {
    id: 'cpp-2', courseId: 'cpp', title: 'Hello C++', type: 'code',
    content: 'Scrivi un programma C++ che stampa "Hello C++!"',
    examples: [
      { code: `#include <iostream>

int main() {
    std::cout << "Hello C++!" << std::endl;
    return 0;
}`, language: 'cpp', caption: 'Esempio' },
    ],
    code: '#include <iostream>\n\nint main() {\n    // Scrivi qui\n    return 0;\n}', expectedOutput: 'Hello C++!', xp: 25, order: 2
  },
  {
    id: 'cpp-3', courseId: 'cpp', title: 'Variabili e Tipi', type: 'theory',
    content: 'C++ è fortemente tipizzato. I tipi principali sono int, double, float, char, bool, string (con <string>).',
    examples: [
      { code: `#include <iostream>
#include <string>

int main() {
    int età = 25;
    double prezzo = 19.99;
    std::string nome = "Mario";
    std::cout << nome << " ha " << età << " anni" << std::endl;
    return 0;
}`, language: 'cpp', caption: 'Variabili' },
    ],
    xp: 15, order: 3
  },
  {
    id: 'cpp-4', courseId: 'cpp', title: 'Quiz C++', type: 'quiz',
    content: 'Testa le basi!', xp: 15, order: 4, quiz: [
      { question: 'Quale libreria serve per std::cout?', options: ['<stdio>', '<iostream>', '<console>', '<output>'], correct: 1, explanation: '<iostream> è la libreria standard per input/output in C++.' },
      { question: 'Quale tipo per numeri decimali?', options: ['int', 'float', 'char', 'bool'], correct: 1, explanation: 'float e double sono i tipi per numeri decimali in C++.' },
    ]
  },
  {
    id: 'cpp-5', courseId: 'cpp', title: 'Puntatori e Riferimenti', type: 'theory',
    content: 'I puntatori memorizzano indirizzi di memoria. I riferimenti sono alias di variabili esistenti.',
    examples: [
      { code: `int x = 10;
int* ptr = &x;
int& ref = x;
std::cout << *ptr << std::endl;
std::cout << ref << std::endl;`, language: 'cpp', caption: 'Puntatori' },
    ],
    xp: 15, order: 5
  },
  {
    id: 'cpp-6', courseId: 'cpp', title: 'Classi', type: 'theory',
    content: 'Le classi in C++ supportano incapsulamento, ereditarietà e polimorfismo. I membri possono essere public, private o protected.',
    examples: [
      { code: `class Persona {
public:
    std::string nome;
    void saluta() {
        std::cout << "Ciao, " << nome << std::endl;
    }
};`, language: 'cpp', caption: 'Classe base' },
    ],
    xp: 15, order: 6
  },
  {
    id: 'cpp-7', courseId: 'cpp', title: 'If e Cicli', type: 'code',
    content: 'Scrivi un ciclo for che stampa i numeri da 1 a 3.',
    examples: [
      { code: `for (int i = 1; i <= 3; i++) {
    std::cout << i << std::endl;
}`, language: 'cpp', caption: 'Esempio' },
    ],
    code: '// Scrivi qui\n', expectedOutput: '1\n2\n3', xp: 20, order: 7
  },
  {
    id: 'cpp-8', courseId: 'cpp', title: 'Quiz C++ Intermedio', type: 'quiz',
    content: 'Quiz su puntatori e classi!', xp: 20, order: 8, quiz: [
      { question: 'Cosa restituisce &x?', options: ['Il valore di x', 'L\'indirizzo di x', 'La somma', 'Niente'], correct: 1, explanation: '&x restituisce l\'indirizzo di memoria della variabile x.' },
      { question: 'Quale access specifier è il default in class?', options: ['public', 'private', 'protected', 'internal'], correct: 1, explanation: 'In una class i membri sono private di default. In struct sono public.' },
    ]
  },
  {
    id: 'cpp-9', courseId: 'cpp', title: 'Vector', type: 'theory',
    content: 'std::vector è un array dinamico della STL. Gestisce automaticamente la memoria.',
    examples: [
      { code: `#include <vector>
std::vector<int> numeri = {1, 2, 3};
numeri.push_back(4);
std::cout << numeri[0] << std::endl;`, language: 'cpp', caption: 'Vector' },
    ],
    xp: 15, order: 9
  },
  {
    id: 'cpp-10', courseId: 'cpp', title: 'Progetto: Calcolatrice', type: 'code',
    content: 'Crea una funzione somma(int a, int b) che stampa il risultato.',
    examples: [
      { code: `#include <iostream>

int somma(int a, int b) {
    return a + b;
}

int main() {
    std::cout << somma(5, 3) << std::endl;
    return 0;
}`, language: 'cpp', caption: 'Esempio' },
    ],
    code: '#include <iostream>\n\nint somma(int a, int b) {\n    // Scrivi qui\n}\n\nint main() {\n    std::cout << somma(5, 3) << std::endl;\n    return 0;\n}', expectedOutput: '8', xp: 25, order: 10
  },
  {
    id: 'cpp-11', courseId: 'cpp', title: 'Quiz C++ Avanzato', type: 'quiz',
    content: 'Quiz finale C++!', xp: 20, order: 11, quiz: [
      { question: 'Quale metodo aggiunge a un vector?', options: ['add()', 'push_back()', 'append()', 'insert()'], correct: 1, explanation: 'push_back() aggiunge un elemento alla fine di un vector.' },
      { question: 'Cosa fa delete ptr?', options: ['Cancella il puntatore', 'Libera la memoria', 'Crea un oggetto', 'Nulla'], correct: 1, explanation: 'delete libera la memoria allocata dinamicamente puntata da ptr.' },
    ]
  },
  {
    id: 'cpp-12', courseId: 'cpp', title: 'Progetto: Conta Pari', type: 'code',
    content: 'Crea un vector con {1,2,3,4,5} e stampa quanti numeri sono pari.',
    examples: [
      { code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> n = {1, 2, 3, 4, 5};
    int count = 0;
    for (int x : n) {
        if (x % 2 == 0) count++;
    }
    std::cout << count << std::endl;
    return 0;
}`, language: 'cpp', caption: 'Esempio' },
    ],
    code: '#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> n = {1, 2, 3, 4, 5};\n    // Scrivi qui\n    return 0;\n}', expectedOutput: '2', xp: 25, order: 12
  },

  // ========== C ==========
  {
    id: 'c-1', courseId: 'c', title: 'Le fondamenta: C', type: 'theory',
    content: 'Il linguaggio C è la base di quasi tutti i sistemi operativi moderni. È potente, efficiente ma richiede attenzione nella gestione della memoria.',
    examples: [
      { code: `#include <stdio.h>

int main() {
    printf("Hello C!\n");
    return 0;
}`, language: 'c', caption: 'Programma base' },
    ],
    xp: 10, order: 1
  },
  {
    id: 'c-2', courseId: 'c', title: 'Hello C', type: 'code',
    content: 'Scrivi un programma C che stampa "Hello C!"',
    examples: [
      { code: `#include <stdio.h>

int main() {
    printf("Hello C!\n");
    return 0;
}`, language: 'c', caption: 'Esempio' },
    ],
    code: '#include <stdio.h>\n\nint main() {\n    // Scrivi qui\n    return 0;\n}', expectedOutput: 'Hello C!', xp: 25, order: 2
  },
  {
    id: 'c-3', courseId: 'c', title: 'Variabili e Formati', type: 'theory',
    content: 'In C le variabili devono essere dichiarate con tipo. printf usa specificatori di formato: %d per int, %f per float, %s per stringhe, %c per char.',
    examples: [
      { code: `int età = 25;
float prezzo = 19.99;
printf("Età: %d, Prezzo: %.2f\n", età, prezzo);`, language: 'c', caption: 'Formati printf' },
    ],
    xp: 15, order: 3
  },
  {
    id: 'c-4', courseId: 'c', title: 'Quiz C', type: 'quiz',
    content: 'Testa le basi!', xp: 15, order: 4, quiz: [
      { question: 'Quale libreria per printf?', options: ['<stdlib>', '<stdio.h>', '<print>', '<console>'], correct: 1, explanation: '<stdio.h> (standard input/output) contiene printf e scanf.' },
      { question: 'Quale formato per un intero?', options: ['%f', '%d', '%s', '%c'], correct: 1, explanation: '%d è il formato per stampare numeri interi con printf.' },
    ]
  },
  {
    id: 'c-5', courseId: 'c', title: 'Puntatori', type: 'theory',
    content: 'I puntatori in C memorizzano indirizzi di memoria. Sono fondamentali per l\'allocazione dinamica e il passaggio per riferimento.',
    examples: [
      { code: `int x = 10;
int *ptr = &x;
printf("Valore: %d\n", *ptr);
printf("Indirizzo: %p\n", (void*)ptr);`, language: 'c', caption: 'Puntatori' },
    ],
    xp: 15, order: 5
  },
  {
    id: 'c-6', courseId: 'c', title: 'Array', type: 'theory',
    content: 'Gli array in C hanno dimensione fissa e gli elementi sono memorizzati in locazioni contigue di memoria.',
    examples: [
      { code: `int numeri[5] = {1, 2, 3, 4, 5};
printf("Primo: %d\n", numeri[0]);
printf("Terzo: %d\n", numeri[2]);`, language: 'c', caption: 'Array' },
    ],
    xp: 15, order: 6
  },
  {
    id: 'c-7', courseId: 'c', title: 'Ciclo For', type: 'code',
    content: 'Scrivi un ciclo for che stampa i numeri da 1 a 3.',
    examples: [
      { code: `for (int i = 1; i <= 3; i++) {
    printf("%d\n", i);
}`, language: 'c', caption: 'Esempio' },
    ],
    code: '// Scrivi qui\n', expectedOutput: '1\n2\n3', xp: 20, order: 7
  },
  {
    id: 'c-8', courseId: 'c', title: 'Quiz C Intermedio', type: 'quiz',
    content: 'Quiz su puntatori e array!', xp: 20, order: 8, quiz: [
      { question: 'Cosa memorizza un puntatore?', options: ['Un valore', 'Un indirizzo', 'Una stringa', 'Un array'], correct: 1, explanation: 'Un puntatore memorizza l\'indirizzo di memoria di un\'altra variabile.' },
      { question: 'Quale operatore ottiene l\'indirizzo?', options: ['*', '&', '@', '#'], correct: 1, explanation: '& (ampersand) restituisce l\'indirizzo di memoria di una variabile.' },
    ]
  },
  {
    id: 'c-9', courseId: 'c', title: 'Malloc e Free', type: 'theory',
    content: 'malloc alloca memoria dinamicamente dall\'heap. free la libera. Dimenticare free causa memory leak.',
    examples: [
      { code: `int *arr = (int*)malloc(5 * sizeof(int));
arr[0] = 10;
printf("%d\n", arr[0]);
free(arr);`, language: 'c', caption: 'Allocazione dinamica' },
    ],
    xp: 15, order: 9
  },
  {
    id: 'c-10', courseId: 'c', title: 'Progetto: Somma Array', type: 'code',
    content: 'Calcola la somma degli elementi di un array {1,2,3,4,5} e stampala.',
    examples: [
      { code: `#include <stdio.h>

int main() {
    int n[] = {1, 2, 3, 4, 5};
    int somma = 0;
    for (int i = 0; i < 5; i++) {
        somma += n[i];
    }
    printf("%d\n", somma);
    return 0;
}`, language: 'c', caption: 'Esempio' },
    ],
    code: '#include <stdio.h>\n\nint main() {\n    int n[] = {1, 2, 3, 4, 5};\n    // Scrivi qui\n    return 0;\n}', expectedOutput: '15', xp: 25, order: 10
  },

  // ========== PHP ==========
  {
    id: 'php-1', courseId: 'php', title: 'PHP nel Web', type: 'theory',
    content: 'PHP è un linguaggio server-side progettato per il web. Alimenta CMS come WordPress e framework come Laravel.',
    examples: [
      { code: `<?php
$nome = "Mario";
echo "Ciao, " . $nome . "!";
?>`, language: 'php', caption: 'Variabile e echo' },
    ],
    xp: 10, order: 1
  },
  {
    id: 'php-2', courseId: 'php', title: 'Hello PHP', type: 'code',
    content: 'Scrivi uno script PHP che stampa "Hello PHP!"',
    examples: [
      { code: `<?php
echo "Hello PHP!";
?>`, language: 'php', caption: 'Esempio' },
    ],
    code: '<?php\n// Scrivi qui\n?>', expectedOutput: 'Hello PHP!', xp: 20, order: 2
  },
  {
    id: 'php-3', courseId: 'php', title: 'Variabili e Stringhe', type: 'theory',
    content: 'In PHP le variabili iniziano con $. Le stringhe possono usare concatenazione con . o interpolazione con doppi apici.',
    examples: [
      { code: `<?php
$nome = "Mario";
$età = 25;
echo "Ciao, $nome!";
echo "Hai " . $età . " anni";
?>`, language: 'php', caption: 'Stringhe' },
    ],
    xp: 15, order: 3
  },
  {
    id: 'php-4', courseId: 'php', title: 'Quiz PHP', type: 'quiz',
    content: 'Testa le basi!', xp: 15, order: 4, quiz: [
      { question: 'Come inizia una variabile in PHP?', options: ['@', '$', '#', '%'], correct: 1, explanation: 'In PHP tutte le variabili iniziano con il simbolo $.' },
      { question: 'Quale operatore concatena stringhe?', options: ['+', '.', ',', '&'], correct: 1, explanation: 'Il punto (.) è l\'operatore di concatenazione in PHP.' },
    ]
  },
  {
    id: 'php-5', courseId: 'php', title: 'Array Associativi', type: 'theory',
    content: 'Gli array in PHP possono essere indicizzati numericamente o associativi (chiave-valore).',
    examples: [
      { code: `<?php
$persona = [
    "nome" => "Mario",
    "età" => 25
];
echo $persona["nome"];
?>`, language: 'php', caption: 'Array associativo' },
    ],
    xp: 15, order: 5
  },
  {
    id: 'php-6', courseId: 'php', title: 'If e Foreach', type: 'code',
    content: 'Scrivi un foreach che stampa i valori di un array ["a","b","c"].',
    examples: [
      { code: `<?php
$lettere = ["a", "b", "c"];
foreach ($lettere as $l) {
    echo $l . "\n";
}
?>`, language: 'php', caption: 'Esempio' },
    ],
    code: '<?php\n$lettere = ["a", "b", "c"];\n// Scrivi qui\n?>', expectedOutput: 'a', xp: 20, order: 6
  },
  {
    id: 'php-7', courseId: 'php', title: 'Funzioni', type: 'theory',
    content: 'Le funzioni in PHP si definiscono con function. Possono avere parametri e valori di ritorno.',
    examples: [
      { code: `<?php
function saluta($nome) {
    return "Ciao, " . $nome . "!";
}
echo saluta("Anna");
?>`, language: 'php', caption: 'Funzione' },
    ],
    xp: 15, order: 7
  },
  {
    id: 'php-8', courseId: 'php', title: 'Superglobals', type: 'theory',
    content: 'PHP fornisce variabili superglobali come $_GET, $_POST, $_SESSION per accedere a dati della richiesta HTTP.',
    examples: [
      { code: `<?php
// URL: pagina.php?nome=Mario
$nome = $_GET["nome"];
echo "Ciao, " . $nome;
?>`, language: 'php', caption: '$_GET' },
    ],
    xp: 15, order: 8
  },
  {
    id: 'php-9', courseId: 'php', title: 'Quiz PHP Intermedio', type: 'quiz',
    content: 'Quiz su array e funzioni!', xp: 20, order: 9, quiz: [
      { question: 'Come si accede al valore con chiave "nome"?', options: ['$arr.nome', '$arr["nome"]', '$arr->nome', '$arr{nome}'], correct: 1, explanation: 'Gli array associativi in PHP usano le parentesi quadre con la chiave tra virgolette.' },
      { question: 'Quale superglobal contiene i dati POST?', options: ['$_GET', '$_POST', '$_REQUEST', '$_DATA'], correct: 1, explanation: '$_POST contiene i dati inviati con il metodo HTTP POST.' },
    ]
  },
  {
    id: 'php-10', courseId: 'php', title: 'Progetto: Calcolatrice', type: 'code',
    content: 'Crea una funzione somma($a, $b) che stampa il risultato.',
    examples: [
      { code: `<?php
function somma($a, $b) {
    return $a + $b;
}
echo somma(5, 3);
?>`, language: 'php', caption: 'Esempio' },
    ],
    code: '<?php\n// Scrivi qui\necho somma(5, 3);\n?>', expectedOutput: '8', xp: 25, order: 10
  },
];

export function getLessonsByCourse(courseId: string): Lesson[] {
  return lessons.filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);
}

export function getCourseById(id: string): Course | undefined {
  return courses.find(c => c.id === id);
}
