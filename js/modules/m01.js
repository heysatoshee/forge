// Module 1: First Steps
// Writing rule for all lessons: short sentences, one idea per sentence,
// simple words, active voice (roughly "80% of the way to ASD-STE100").
MODULES.m01 = {
  id: "m01",
  title: "First Steps",
  goal: "Write, run and understand your first Rust programs. Use variables and basic types with confidence.",
  skills: ["Compiling & running", "Cargo", "Variables", "Mutability", "Types"],
  lessons: [
    // ─────────────────────────────────────────────────────────── Lesson 1
    {
      id: "l1",
      title: "Meet Rust",
      minutes: 6,
      skill: "Compiling & running",
      steps: [
        {
          type: "read",
          title: "What is a program?",
          body: [
            "A **program** is a list of instructions for a computer.",
            "The computer follows the instructions exactly. It does not guess what you mean. If an instruction is wrong, the result is wrong.",
            "**Rust** is a language for writing these instructions. You write words and symbols. Rust turns them into something the computer can run.",
            { tip: "You do not need to remember everything in this course. You will practice each idea many times." }
          ]
        },
        {
          type: "explainer",
          title: "How your code becomes a program",
          scenes: [
            {
              say: "You write instructions in a file. We call this source code. People can read it. The file for a Rust program ends in .rs",
              visual: `<div class="ex-row"><div class="ex-file pop"><div class="ex-file-name">main.rs</div><div class="ex-line w80"></div><div class="ex-line w60"></div><div class="ex-line w70"></div><div class="ex-line w40"></div></div></div><div class="ex-caption-sm pop d2">source code = text you write</div>`
            },
            {
              say: "Next, you give the file to the compiler. The compiler is a program that reads your code. Rust's compiler is called rustc.",
              visual: `<div class="ex-row"><div class="ex-file"><div class="ex-file-name">main.rs</div><div class="ex-line w80"></div><div class="ex-line w60"></div><div class="ex-line w70"></div></div><div class="ex-arrow pop d1"></div><div class="ex-gear pop d2"><i class="ph-duotone ph-gear-six spin"></i><b>rustc</b><small>the compiler</small></div></div>`
            },
            {
              say: "The compiler checks every line. If it finds a mistake, it stops. It tells you where the mistake is, and often how to fix it.",
              visual: `<div class="ex-row"><div class="ex-gear"><i class="ph-duotone ph-gear-six spin"></i><b>rustc</b></div><div class="ex-arrow bad pop d1"></div><div class="ex-error pop d2"><b>error</b>: missing <code>;</code><br><span>--> main.rs:3:28</span><br><em>help: add <code>;</code> here</em></div></div>`
            },
            {
              say: "When there are no mistakes, the compiler makes a new file. This file contains machine code. Machine code is the language of the computer.",
              visual: `<div class="ex-row"><div class="ex-gear"><i class="ph-duotone ph-gear-six spin"></i><b>rustc</b></div><div class="ex-arrow ok pop d1"></div><div class="ex-bin pop d2"><div class="ex-file-name">hello</div><code>01001000<br>01100101<br>01101100<br>01101111</code><small>machine code</small></div></div>`
            },
            {
              say: "Now you can run the program as many times as you like. You do not need the compiler to run it. The work is already done. This is one reason Rust programs are fast.",
              visual: `<div class="ex-row"><div class="ex-bin"><div class="ex-file-name">hello</div><code>0100<br>1001</code></div><div class="ex-arrow ok pop d1"></div><div class="ex-term pop d2"><div>$ ./hello</div><div class="ok">Hello, world!</div><div>$ ./hello</div><div class="ok">Hello, world!</div></div></div>`
            },
            {
              say: "Some languages work in a different way. In Python, an interpreter reads your code line by line, every time the program runs. It finds some mistakes only while the program is running. Rust finds many mistakes before the program ever runs.",
              visual: `<div class="ex-compare"><div class="ex-lane pop"><b>Rust</b><div class="ex-chips"><span>code</span><i class="ph-bold ph-arrow-right"></i><span class="hl">check all</span><i class="ph-bold ph-arrow-right"></i><span>program</span><i class="ph-bold ph-arrow-right"></i><span class="ok">run <i class="ph-bold ph-check"></i></span></div><small>Mistakes found <b>before</b> running</small></div><div class="ex-lane pop d2"><b>Python</b><div class="ex-chips"><span>code</span><i class="ph-bold ph-arrow-right"></i><span>run line 1</span><i class="ph-bold ph-arrow-right"></i><span>line 2</span><i class="ph-bold ph-arrow-right"></i><span class="bad">line 3 <i class="ph-bold ph-x"></i></span></div><small>Some mistakes found <b>while</b> running</small></div></div>`
            }
          ]
        },
        {
          type: "mcq",
          prompt: "What does the compiler do?",
          options: [
            "It runs your program line by line",
            "It checks your code and turns it into a program the computer can run",
            "It writes code for you",
            "It stores your files on the internet"
          ],
          answer: 1,
          explain: "The compiler reads all of your code, checks it for mistakes, and makes a program in machine code."
        },
        {
          type: "read",
          title: "Why people choose Rust",
          body: [
            "Rust has three big strengths. Together, they are rare.",
            {
              cards: [
                { icon: "gauge", title: "Fast", text: "Rust makes machine code, like C and C++. It has no garbage collector that pauses your program to clean memory." },
                { icon: "shield-check", title: "Safe", text: "The compiler finds memory mistakes before your program runs. Whole groups of bugs cannot happen." },
                { icon: "chats-circle", title: "Helpful", text: "Error messages explain the problem in plain words. They often show the fix." }
              ]
            },
            "These products and companies use Rust. Teams pick it when speed and safety both matter.",
            { logos: [["firefoxbrowser", "Firefox"], ["discord", "Discord"], ["cloudflare", "Cloudflare"], ["dropbox", "Dropbox"], ["amazonwebservices", "AWS"], ["linux", "Linux kernel"]] }
          ]
        },
        {
          type: "read",
          title: "The compiler is your coach",
          body: [
            "New programmers often fear error messages. In Rust, errors are your friend. Here is a real one:",
            {
              terminal: `error[E0384]: cannot assign twice to immutable variable \`x\`
 --> src/main.rs:3:5
  |
2 |     let x = 5;
  |         - first assignment to \`x\`
3 |     x = 6;
  |     ^^^^^ cannot assign twice to immutable variable
  |
help: consider making this binding mutable
  |
2 |     let mut x = 5;
  |         +++`
            },
            "Look at the parts. The **first line** says what is wrong. The **arrow** shows the file and line. The **help** shows a fix.",
            "You do not need to understand this error yet. You will learn about `mut` in Lesson 4. For now, remember this: **read the whole error message**. It is trying to help you."
          ]
        },
        {
          type: "mcq",
          prompt: "When does Rust find most mistakes in your code?",
          options: ["After you share the program", "While the program runs", "Before the program runs, when it compiles", "Never. You must find them yourself"],
          answer: 2,
          explain: "Rust checks your code when it compiles. We call this **compile time**. Many bugs never reach the running program."
        },
        {
          type: "order",
          prompt: "Put the steps in the correct order.",
          items: ["Write source code", "Compile it with rustc", "Fix any errors the compiler shows", "Run the program"],
          explain: "Write, compile, fix, run. You will repeat this loop thousands of times. It gets fast."
        },
        {
          type: "recap",
          points: [
            "A program is a list of exact instructions.",
            "The compiler checks your code and makes machine code.",
            "Rust finds many mistakes at compile time, before the program runs.",
            "Error messages are a coach. Read all of the message."
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────── Lesson 2
    {
      id: "l2",
      title: "Your First Program",
      minutes: 10,
      skill: "Compiling & running",
      steps: [
        {
          type: "anatomy",
          title: "Hello, world!",
          intro: "This is a complete Rust program. Tap each highlighted part to see what it does.",
          lines: [
            [["fn", "fn"], " ", ["main", "main"], ["()", "parens"], " ", ["{", "brace"]],
            ["    ", ["println!", "println"], "(", ['"Hello, world!"', "string"], ")", [";", "semi"]],
            [["}", "brace"]]
          ],
          notes: {
            fn: { label: "fn", text: "Short for **function**. A function is a named group of instructions. `fn` tells Rust: a function starts here." },
            main: { label: "main", text: "The name of the function. `main` is special. Every Rust program starts by running `main`." },
            parens: { label: "( )", text: "Parentheses hold the function's **inputs**. `main` takes no inputs, so they are empty." },
            brace: { label: "{ }", text: "Curly braces mark the **body** of the function. The instructions go between them." },
            println: { label: "println!", text: "Prints text, then moves to a new line. The `!` means it is a **macro**, a special kind of function. For now: macros have a `!`." },
            string: { label: "\"Hello, world!\"", text: "Text inside double quotes is a **string**. The program prints it exactly as written." },
            semi: { label: ";", text: "The semicolon ends an instruction, like a full stop ends a sentence." }
          }
        },
        {
          type: "code",
          title: "Run it",
          task: "Press **Run** (or ⌘/Ctrl + Enter). Your code goes to the real Rust compiler. Watch the output.",
          starter: `fn main() {
    println!("Hello, world!");
}`,
          check: { success: true, stdoutIncludes: ["Hello, world!"] },
          hints: ["You do not need to change anything. Just press Run."],
          solution: `fn main() {
    println!("Hello, world!");
}`
        },
        {
          type: "code",
          title: "Make it yours",
          task: "Change the program so it prints `Hello, ` and then **your name**, then `!`. For example: `Hello, Ada!`",
          starter: `fn main() {
    println!("Hello, world!");
}`,
          check: { success: true, stdoutRegex: "^Hello, (?!world!)\\S.*!\\s*$", failMsg: "The output should look like Hello, YourName! (and not Hello, world!)." },
          hints: ["Change only the text between the double quotes.", "Keep the quotes, the `!` after println and the `;` at the end."],
          solution: `fn main() {
    println!("Hello, Ferris!");
}`
        },
        {
          type: "read",
          title: "Printing values with {}",
          body: [
            "`println!` can print values inside text. Put `{}` where a value should go. Then give the value after a comma.",
            { code: `println!("I am {} years old", 30);
// prints: I am 30 years old` },
            "Each `{}` is a **placeholder**. Rust fills the placeholders in order, from left to right.",
            { code: `println!("{} plus {} is {}", 2, 3, 2 + 3);
// prints: 2 plus 3 is 5` },
            "Notice `2 + 3`. Rust calculates it first, then prints `5`.",
            { tip: "Lines that start with `//` are **comments**. Rust ignores them. They are notes for people." }
          ]
        },
        {
          type: "mcq",
          prompt: "What does this print?",
          code: `println!("{} x {} = {}", 4, 5, 4 * 5);`,
          options: ["{} x {} = {}", "4 x 5 = 4 * 5", "4 x 5 = 20", "20 = 4 x 5"],
          answer: 2,
          explain: "The placeholders fill in order: `4`, then `5`, then the result of `4 * 5`, which is `20`."
        },
        {
          type: "compile",
          prompt: "Will this program compile?",
          code: `fn main() {
    println("Hello");
}`,
          answer: false,
          explain: "It is missing the `!`. `println` is a macro, so you must write `println!`. The compiler says: *expected function, found macro*."
        },
        {
          type: "code",
          title: "Fix the error",
          task: "This program does not compile. Press **Run** to see the error. Read it, then fix the code.",
          starter: `fn main() {
    println!("Rust is fun")
    println!("Let's build things!");
}`,
          check: { success: true, stdoutIncludes: ["Rust is fun", "Let's build things!"] },
          hints: ["Look at the line number in the error message.", "One instruction is missing the mark that ends it.", "Add `;` at the end of line 2."],
          solution: `fn main() {
    println!("Rust is fun");
    println!("Let's build things!");
}`
        },
        {
          type: "fill",
          prompt: "Fill in the blanks to make a working program.",
          template: `[0] main() {
    println[1]("Ready!");
}`,
          answers: [["fn"], ["!"]],
          explain: "`fn` starts a function. `!` marks `println!` as a macro."
        },
        {
          type: "code",
          title: "Three lines about you",
          task: "Print **at least three lines**. Use one `println!` for each line. Use `{}` at least once. For example: `I have {} pets`.",
          starter: `fn main() {
    println!("My name is Ferris.");
    // add more lines here
}`,
          check: { success: true, minLines: 3, codeRegex: ["\\{\\}.*\"\\s*,"], failMsg: "Print three or more lines, and use a {} placeholder with a value at least once." },
          hints: ["Copy the first line two times and change the text.", "To use a placeholder: `println!(\"I am {} years old\", 30);`"],
          solution: `fn main() {
    println!("My name is Ferris.");
    println!("I have {} claws.", 2);
    println!("I like to build things.");
}`
        },
        {
          type: "recap",
          points: [
            "Every program starts in `fn main() { }`.",
            "`println!` prints a line. The `!` means it is a macro.",
            "`{}` is a placeholder. Values fill placeholders in order.",
            "A `;` ends each instruction.",
            "When code fails, read the error. Go to the line it shows."
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────── Lesson 3
    {
      id: "l3",
      title: "Cargo, Your Project Helper",
      minutes: 8,
      skill: "Cargo",
      steps: [
        {
          type: "read",
          title: "Three tools",
          body: [
            "When you install Rust, you get three tools. Each tool has one job.",
            {
              cards: [
                { icon: "download-simple", title: "rustup", text: "Installs Rust and keeps it up to date." },
                { icon: "gear-six", title: "rustc", text: "The compiler. It turns code into a program." },
                { icon: "package", title: "cargo", text: "Your project helper. It creates projects, calls rustc for you, and downloads libraries." }
              ]
            },
            "Real Rust developers almost never call `rustc` directly. They use **Cargo** for everything."
          ]
        },
        {
          type: "read",
          title: "Install Rust (when you are ready)",
          body: [
            "You can do this whole module in the browser. Install Rust on your computer when you want to build bigger projects.",
            "**On macOS or Linux**, open a terminal and run:",
            { shell: "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh" },
            "**On Windows**, go to **rustup.rs** and download the installer.",
            "Then check that it worked:",
            { shell: "cargo --version" },
            { tip: "If you see a version number, like `cargo 1.8x.0`, Rust is ready." }
          ]
        },
        {
          type: "terminal",
          title: "Make a project with Cargo",
          intro: "Type each command and press Enter. Watch the files appear on the right.",
          commands: [
            {
              cmd: "cargo new hello",
              explain: "`cargo new` makes a new project folder with everything you need.",
              output: ["    Creating binary (application) `hello` package"],
              tree: ["hello/", "  Cargo.toml", "  src/", "    main.rs"]
            },
            {
              cmd: "cd hello",
              explain: "`cd` means *change directory*. Now you are inside the project folder.",
              output: []
            },
            {
              cmd: "cargo run",
              explain: "`cargo run` compiles your code and then runs the program. Two steps, one command.",
              output: [
                "   Compiling hello v0.1.0 (/home/you/hello)",
                "    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.52s",
                "     Running `target/debug/hello`",
                "!!Hello, world!"
              ],
              tree: ["hello/", "  Cargo.lock", "  Cargo.toml", "  src/", "    main.rs", "  target/", "    debug/", "      hello"]
            }
          ]
        },
        {
          type: "files",
          title: "What is inside a project?",
          intro: "Tap each file to look inside.",
          files: [
            {
              path: "Cargo.toml",
              content: `[package]
name = "hello"
version = "0.1.0"
edition = "2021"

[dependencies]`,
              note: "The project's **settings**. It has the name and version. Under `[dependencies]` you list libraries you want to use. Cargo downloads them for you."
            },
            {
              path: "src/main.rs",
              content: `fn main() {
    println!("Hello, world!");
}`,
              note: "**Your code** lives here. Cargo starts you with Hello, world!"
            },
            {
              path: "Cargo.lock",
              content: `# This file is automatically @generated by Cargo.
# It is not intended for manual editing.
version = 4

[[package]]
name = "hello"
version = "0.1.0"`,
              note: "Cargo writes this file. It records the exact versions of every library. Do not edit it."
            },
            {
              path: "target/",
              content: `debug/
  hello      <- your compiled program`,
              note: "The **output** folder. Compiled programs go here. You can delete it at any time. Cargo makes it again."
            }
          ]
        },
        {
          type: "mcq",
          prompt: "You want to change what your program does. Which file do you edit?",
          options: ["Cargo.toml", "Cargo.lock", "src/main.rs", "target/debug/hello"],
          answer: 2,
          explain: "Your code lives in `src/main.rs`. `Cargo.toml` holds settings. The other two are made by Cargo."
        },
        {
          type: "read",
          title: "Four commands you will use every day",
          body: [
            {
              table: {
                head: ["Command", "What it does", "When to use it"],
                rows: [
                  ["`cargo run`", "Compile, then run", "Most of the time"],
                  ["`cargo check`", "Check for errors. Do not make a program", "To check your code fast"],
                  ["`cargo build`", "Compile only", "To make the program without running it"],
                  ["`cargo build --release`", "Compile with full speed settings", "When you share or measure your program"]
                ]
              }
            },
            "`cargo check` is much faster than `cargo build`. Many developers run it again and again while they write code.",
            { tip: "A **release** build takes longer to compile, but the program can run 10 to 100 times faster than a normal (debug) build." }
          ]
        },
        {
          type: "mcq",
          prompt: "You only want to know if your code has errors. You do not need a program yet. Which command is fastest?",
          options: ["cargo run", "cargo build --release", "cargo check", "cargo new"],
          answer: 2,
          explain: "`cargo check` finds errors but skips making machine code. That makes it the fastest."
        },
        {
          type: "order",
          prompt: "Put these in order to make and run a new project called app.",
          items: ["cargo new app", "cd app", "edit src/main.rs", "cargo run"],
          code: true,
          explain: "Make the project, go into its folder, write your code, then run it."
        },
        {
          type: "recap",
          points: [
            "rustup installs Rust. rustc compiles. Cargo manages projects.",
            "`cargo new name` makes a project. Your code is in `src/main.rs`.",
            "`cargo run` compiles and runs. `cargo check` only checks.",
            "`Cargo.toml` holds settings and the list of libraries."
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────── Lesson 4
    {
      id: "l4",
      title: "Variables",
      minutes: 12,
      skill: "Variables",
      steps: [
        {
          type: "read",
          title: "A name for a value",
          body: [
            "A **variable** is a name for a value. Think of a box with a label. The label is the name. The value is inside the box.",
            "You make a variable with `let`:",
            { code: `let age = 30;` },
            "Read it like this: *let age be 30*. Now you can use `age` anywhere you need 30.",
            "You can put a variable's name directly inside `{}`:",
            { code: `let age = 30;
println!("I am {age} years old");` }
          ]
        },
        {
          type: "memory",
          title: "Watch the boxes",
          intro: "Press **Step** to run one line at a time. Watch the memory boxes.",
          code: [
            `let apples = 5;`,
            `let price = 2;`,
            `let total = apples * price;`,
            `println!("Total: {total}");`
          ],
          frames: [
            { line: -1, boxes: [], note: "Nothing has run yet. Memory is empty. Press **Step**." },
            { line: 0, boxes: [{ name: "apples", value: "5", type: "i32", state: "new" }], note: "`let` makes a new box called `apples`. Rust puts `5` inside." },
            { line: 1, boxes: [{ name: "apples", value: "5", type: "i32" }, { name: "price", value: "2", type: "i32", state: "new" }], note: "A second box, called `price`, holds `2`." },
            { line: 2, boxes: [{ name: "apples", value: "5", type: "i32", state: "read" }, { name: "price", value: "2", type: "i32", state: "read" }, { name: "total", value: "10", type: "i32", state: "new" }], note: "Rust reads `apples` and `price`, multiplies them, and puts `10` in a new box." },
            { line: 3, boxes: [{ name: "apples", value: "5", type: "i32" }, { name: "price", value: "2", type: "i32" }, { name: "total", value: "10", type: "i32", state: "read" }], output: "Total: 10", note: "`println!` reads the box `total` and prints its value." }
          ]
        },
        {
          type: "code",
          title: "Your first variable",
          task: "Make a variable called `city`. Put the name of a city in it, in double quotes. Then print `I live in ` and the city. For example: `I live in Lagos`.",
          starter: `fn main() {
    // make your variable here

    println!("I live in {}", ???);
}`,
          check: { success: true, codeRegex: ["let\\s+city\\s*="], stdoutRegex: "I live in \\S+", failMsg: "Create `let city = \"...\";` and print I live in <city>." },
          hints: ["Write `let city = \"Lagos\";` on the empty line.", "Replace `???` with the variable name `city`.", "Or put the name in the braces: `println!(\"I live in {city}\");`"],
          solution: `fn main() {
    let city = "Lagos";
    println!("I live in {}", city);
}`
        },
        {
          type: "read",
          title: "Values do not change (by default)",
          body: [
            "In Rust, a variable **cannot change** after you set it. We say it is **immutable**.",
            { code: `let score = 10;
score = 20; // ERROR: cannot assign twice` },
            "Why? Because it makes code easier to trust. When you see `let score = 10;`, you *know* `score` is still `10` later. No other line can change it by surprise.",
            "When you **want** a value to change, say so with `mut`. It is short for **mutable**, which means *able to change*:",
            { code: `let mut score = 10;
score = 20; // OK
println!("{score}"); // prints 20` }
          ]
        },
        {
          type: "compile",
          prompt: "Will this compile?",
          code: `fn main() {
    let lives = 3;
    lives = lives - 1;
    println!("{lives}");
}`,
          answer: false,
          explain: "`lives` is immutable. To change it, write `let mut lives = 3;`."
        },
        {
          type: "memory",
          title: "A box that can change",
          intro: "This box has `mut`. Step through and watch its value change.",
          code: [
            `let mut score = 0;`,
            `score = score + 10;`,
            `score += 5;`,
            `println!("Score: {score}");`
          ],
          frames: [
            { line: -1, boxes: [], note: "Press **Step**." },
            { line: 0, boxes: [{ name: "score", value: "0", type: "i32", mut: true, state: "new" }], note: "`let mut` makes a box that *can* change. It starts at `0`." },
            { line: 1, boxes: [{ name: "score", value: "10", type: "i32", mut: true, state: "changed", was: "0" }], note: "Rust reads `score` (0), adds 10, and puts `10` back in the **same** box." },
            { line: 2, boxes: [{ name: "score", value: "15", type: "i32", mut: true, state: "changed", was: "10" }], note: "`+=` is a short way to write `score = score + 5`." },
            { line: 3, boxes: [{ name: "score", value: "15", type: "i32", mut: true, state: "read" }], output: "Score: 15", note: "There was only one box the whole time. Its value changed." }
          ]
        },
        {
          type: "code",
          title: "Level up",
          task: "This code does not compile. Fix it so it prints `Level: 3`. Do not delete the lines that add 1.",
          starter: `fn main() {
    let level = 1;
    level += 1;
    level += 1;
    println!("Level: {level}");
}`,
          check: { success: true, stdoutIncludes: ["Level: 3"], codeRegex: ["\\+=\\s*1[\\s\\S]*\\+=\\s*1"], failMsg: "Keep both `level += 1;` lines and print Level: 3." },
          hints: ["Run it first. Read the help line in the error.", "The variable must be able to change.", "Write `let mut level = 1;`"],
          solution: `fn main() {
    let mut level = 1;
    level += 1;
    level += 1;
    println!("Level: {level}");
}`
        },
        {
          type: "read",
          title: "Shadowing: a new box with the same name",
          body: [
            "You can use `let` again with the same name. This makes a **new** variable. The new one hides the old one. We call this **shadowing**.",
            { code: `let x = 5;
let x = x + 1;   // a new x: 6
let x = x * 2;   // a new x: 12
println!("{x}"); // prints 12` },
            "Shadowing is not the same as `mut`:",
            {
              table: {
                head: ["", "mut", "shadowing (let again)"],
                rows: [
                  ["Boxes", "One box. The value changes.", "A new box each time."],
                  ["Can the type change?", "No", "Yes"],
                  ["Keyword", "`let mut` once, then `x = ...`", "`let x = ...` each time"]
                ]
              }
            }
          ]
        },
        {
          type: "memory",
          title: "Shadowing changes the type",
          intro: "A program gets some spaces as text. We want the number of spaces.",
          code: [
            `let spaces = "   ";`,
            `let spaces = spaces.len();`,
            `println!("{spaces}");`
          ],
          frames: [
            { line: -1, boxes: [], note: "Press **Step**." },
            { line: 0, boxes: [{ name: "spaces", value: "\"   \"", type: "&str", state: "new" }], note: "The first `spaces` holds text: three spaces. Its type is `&str` (text)." },
            { line: 1, boxes: [{ name: "spaces", value: "\"   \"", type: "&str", state: "shadowed" }, { name: "spaces", value: "3", type: "usize", state: "new" }], note: "`.len()` counts the characters. `let` makes a **new** box called `spaces`, with a number inside. The old box is hidden." },
            { line: 2, boxes: [{ name: "spaces", value: "\"   \"", type: "&str", state: "shadowed" }, { name: "spaces", value: "3", type: "usize", state: "read" }], output: "3", note: "The name `spaces` now means the new box. With `mut`, this is not possible: a box cannot change its type." }
          ]
        },
        {
          type: "mcq",
          prompt: "What does this print?",
          code: `let n = 4;
let n = n + 1;
let n = n * 3;
println!("{n}");`,
          options: ["4", "5", "12", "15"],
          answer: 3,
          explain: "Each `let` makes a new `n`: first 4, then 4 + 1 = 5, then 5 × 3 = 15."
        },
        {
          type: "fill",
          prompt: "Fill in the blank so the code compiles.",
          template: `let [0] count = 0;
count += 1;`,
          answers: [["mut"]],
          explain: "`count += 1` changes the value, so the variable must be `mut`."
        },
        {
          type: "recap",
          points: [
            "`let name = value;` makes a variable.",
            "Variables are immutable by default. This makes code easy to trust.",
            "`let mut` makes a variable that can change.",
            "Shadowing (`let` again) makes a new variable with the same name. It can have a new type."
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────── Lesson 5
    {
      id: "l5",
      title: "Basic Types",
      minutes: 14,
      skill: "Types",
      steps: [
        {
          type: "read",
          title: "Every value has a type",
          body: [
            "A **type** tells Rust two things about a value: what kind of value it is, and how much memory it needs.",
            "Rust has four simple types. We call them **scalar** types, because each holds one value.",
            {
              cards: [
                { icon: "hash", title: "Integers", text: "Whole numbers: `-3`, `0`, `42`" },
                { icon: "wave-sine", title: "Floats", text: "Numbers with a decimal point: `3.14`, `-0.5`" },
                { icon: "toggle-right", title: "Booleans", text: "Only two values: `true` or `false`" },
                { icon: "text-aa", title: "Characters", text: "One letter or symbol: `'a'`, `'7'`, `'🦀'`" }
              ]
            }
          ]
        },
        {
          type: "read",
          title: "Integers come in sizes",
          body: [
            "An integer type has two parts: a letter and a number. Example: `u8`.",
            "- The **letter** says if the number can be negative. `i` = can be negative (signed). `u` = never negative (unsigned).\n- The **number** says how many **bits** of memory it uses. More bits = bigger numbers.",
            {
              table: {
                head: ["Bits", "Signed", "Unsigned", "Unsigned range"],
                rows: [
                  ["8", "`i8`", "`u8`", "0 to 255"],
                  ["16", "`i16`", "`u16`", "0 to 65,535"],
                  ["32", "`i32`", "`u32`", "0 to about 4.3 billion"],
                  ["64", "`i64`", "`u64`", "0 to about 18 quintillion"],
                  ["128", "`i128`", "`u128`", "very, very large"]
                ]
              }
            },
            "If you do not choose, Rust uses **`i32`**. It is a good default.",
            { tip: "`usize` is the size your computer prefers (64 bits on most machines). Rust uses it to count items and for positions in a list." }
          ]
        },
        {
          type: "bits",
          title: "Play with bits",
          intro: "A `u8` is 8 bits. Each bit is off (0) or on (1). Tap the bits to make numbers. Then try to go past the limit."
        },
        {
          type: "mcq",
          prompt: "You want to store a person's age. It is never negative and never above 150. Which type uses the least memory?",
          options: ["i32", "u8", "i8", "u64"],
          answer: 1,
          explain: "`u8` holds 0 to 255. Age is never negative, so unsigned works. It uses only 8 bits. (`i8` only goes up to 127.)"
        },
        {
          type: "compile",
          prompt: "Will this compile?",
          code: `fn main() {
    let small: u8 = 256;
    println!("{small}");
}`,
          answer: false,
          explain: "A `u8` holds 0 to 255. `256` does not fit, so the compiler stops you: *literal out of range for `u8`*."
        },
        {
          type: "read",
          title: "Floats and math",
          body: [
            "A **float** is a number with a decimal point. Rust has `f32` and `f64`. The default is **`f64`**. It is more exact and just as fast on modern computers.",
            { code: `let price = 4.99;     // f64
let pi: f32 = 3.14;   // f32, because we said so` },
            "Rust has the usual math signs: `+` `-` `*` `/`. It also has `%`, which gives the **remainder**.",
            { warn: "Dividing two integers drops the decimal part. `7 / 2` is `3`, not `3.5`. To get `3.5`, use floats: `7.0 / 2.0`." },
            "To print a float with a fixed number of decimals, use `{:.2}` (2 decimals):",
            { code: `let total = 10.0 / 3.0;
println!("{total}");     // 3.3333333333333335
println!("{total:.2}");  // 3.33` }
          ]
        },
        {
          type: "mcq",
          prompt: "What does this print?",
          code: `println!("{} {}", 7 / 2, 7 % 2);`,
          options: ["3.5 0", "3 1", "3.5 1", "4 1"],
          answer: 1,
          explain: "Integer division drops the decimals: `7 / 2` = `3`. The remainder: `7 % 2` = `1`."
        },
        {
          type: "read",
          title: "Booleans and characters",
          body: [
            "A **bool** is `true` or `false`. You will use it to make decisions in Module 2.",
            { code: `let is_raining = false;
let is_hot: bool = true;` },
            "A **char** is one character. Use **single** quotes. A char can be a letter, a digit, or even an emoji.",
            { code: `let letter = 'R';
let crab = '🦀';` },
            { warn: "Single quotes `'R'` make a char. Double quotes `\"R\"` make text (a string). They are different types." }
          ]
        },
        {
          type: "read",
          title: "Types must match",
          body: [
            "Rust usually **guesses** the type for you. We call this **type inference**. You can also write the type yourself after a colon:",
            { code: `let a = 5;          // Rust picks i32
let b: u32 = 5;     // you choose u32` },
            "Rust never mixes types by itself. You cannot multiply an integer by a float:",
            { code: `let count: u32 = 3;
let price = 2.5;
let cost = price * count;  // ERROR: f64 * u32` },
            "Use `as` to **convert** a value to another type:",
            { code: `let cost = price * count as f64;  // 7.5` },
            { tip: "This feels strict at first. But it stops a whole class of hidden bugs. You always know what type you have." }
          ]
        },
        {
          type: "compile",
          prompt: "Will this compile?",
          code: `fn main() {
    let a: i32 = 5;
    let b: f64 = 2.0;
    let c = a * b;
    println!("{c}");
}`,
          answer: false,
          explain: "`a` is an `i32` and `b` is an `f64`. Rust does not mix them. Fix it with `a as f64 * b`."
        },
        {
          type: "code",
          title: "Room area",
          task: "A room is `7.5` metres wide and `4` metres long. Store both as `f64` variables. Calculate the area and print it with 2 decimals, like this: `Area: 30.00`",
          starter: `fn main() {
    let width = 7.5;
    // add length, then calculate area

}`,
          check: { success: true, stdoutIncludes: ["Area: 30.00"], codeRegex: ["let\\s+\\w+\\s*(:\\s*f64\\s*)?=\\s*4(\\.0*)?\\s*;", "\\*"] , failMsg: "Store the length (4.0) in a variable, multiply, and print Area: 30.00." },
          hints: ["A float needs a decimal point: `let length = 4.0;`", "Multiply: `let area = width * length;`", "Print with 2 decimals: `println!(\"Area: {area:.2}\");`"],
          solution: `fn main() {
    let width = 7.5;
    let length = 4.0;
    let area = width * length;
    println!("Area: {area:.2}");
}`
        },
        {
          type: "code",
          title: "Temperature converter",
          task: "Convert `25` degrees Celsius to Fahrenheit. The formula is **F = C × 9 / 5 + 32**. Print one decimal: `25°C = 77.0°F`.",
          starter: `fn main() {
    let celsius = 25.0;

}`,
          check: { success: true, stdoutIncludes: ["25°C = 77.0°F"], codeRegex: ["celsius\\s*\\*"], failMsg: "Calculate from `celsius` (don't just print 77.0) and print 25°C = 77.0°F." },
          hints: ["Use floats in the formula: `9.0`, `5.0` and `32.0`.", "`let fahrenheit = celsius * 9.0 / 5.0 + 32.0;`", "Print: `println!(\"{celsius}°C = {fahrenheit:.1}°F\");`"],
          solution: `fn main() {
    let celsius = 25.0;
    let fahrenheit = celsius * 9.0 / 5.0 + 32.0;
    println!("{celsius}°C = {fahrenheit:.1}°F");
}`
        },
        {
          type: "recap",
          points: [
            "Integers: `i` can be negative, `u` cannot. The number is the bits. Default: `i32`.",
            "Floats have a decimal point. Default: `f64`. Integer division drops decimals.",
            "`bool` is true or false. `char` uses single quotes.",
            "Rust never mixes types for you. Convert with `as`.",
            "`{:.2}` prints a float with 2 decimals."
          ]
        }
      ]
    }
  ],

  // ─────────────────────────────────────────────────────────── Module quiz
  quiz: {
    passPct: 80,
    questions: [
      { id: "q1", type: "mcq", prompt: "What does `cargo run` do?", options: ["Only checks for errors", "Compiles the code, then runs the program", "Creates a new project", "Downloads Rust"], answer: 1, explain: "`cargo run` = compile + run. `cargo check` only checks. `cargo new` creates a project." },
      { id: "q2", type: "compile", prompt: "Will this compile?", code: `fn main() {
    let name = "Ada";
    name = "Grace";
    println!("{name}");
}`, answer: false, explain: "`name` is immutable. You need `let mut name`. Or shadow it: `let name = \"Grace\";`" },
      { id: "q3", type: "mcq", prompt: "What does this print?", code: `let x = 10;
let x = x / 3;
println!("{x}");`, options: ["3.33", "3", "10", "It does not compile"], answer: 1, explain: "Shadowing is fine. `10 / 3` with integers is `3`. The decimal part is dropped." },
      { id: "q4", type: "mcq", prompt: "Which line makes a `char`?", options: ["let c = \"A\";", "let c = 'A';", "let c = A;", "let c: char = \"A\";"], answer: 1, explain: "A `char` uses single quotes. Double quotes make text." },
      { id: "q5", type: "fill", prompt: "Fill in the blank.", template: `fn [0]() {
    println!("Start here");
}`, answers: [["main"]], explain: "Every Rust program starts in the `main` function." },
      { id: "q6", type: "compile", prompt: "Will this compile?", code: `fn main() {
    let big: u8 = 300;
    println!("{big}");
}`, answer: false, explain: "A `u8` only goes up to 255." },
      { id: "q7", type: "mcq", prompt: "Why does `println!` have a `!`?", options: ["It prints loudly", "It is a macro", "It marks an error", "It is optional decoration"], answer: 1, explain: "The `!` marks a macro. You must write it." },
      { id: "q8", type: "mcq", prompt: "What does this print?", code: `println!("{}", 7.0 / 2.0);`, options: ["3", "3.5", "4", "It does not compile"], answer: 1, explain: "These are floats, so the decimal part stays: `3.5`." },
      { id: "q9", type: "mcq", prompt: "You write `let n = 42;`. What type does Rust give `n`?", options: ["u8", "i64", "i32", "f64"], answer: 2, explain: "With no other information, integers default to `i32`." },
      { id: "q10", type: "order", prompt: "Order the commands to create and run a project called game.", items: ["cargo new game", "cd game", "cargo run"], code: true, explain: "Create it, go into the folder, run it." },
      { id: "q11", type: "compile", prompt: "Will this compile?", code: `fn main() {
    let mut count = 1;
    count += 1;
    println!("{count}");
}`, answer: true, explain: "`count` is `mut`, so it can change. It prints `2`." },
      { id: "q12", type: "mcq", prompt: "Which code changes the **type** of `x`?", options: ["let mut x = \"5\"; x = 5;", "let x = \"5\"; let x = 5;", "let x = \"5\"; x = 5;", "None. Types can never change."], answer: 1, explain: "Shadowing makes a new variable, so it can have a new type. `mut` cannot change the type." },
      { id: "q13", type: "mcq", prompt: "Which file lists your project's name, version and libraries?", options: ["src/main.rs", "Cargo.toml", "Cargo.lock", "target/"], answer: 1, explain: "`Cargo.toml` holds the project settings and dependencies." },
      { id: "q14", type: "fill", prompt: "Convert `count` so the math works.", template: `let count: u32 = 4;
let price = 1.5;
let cost = price * count [0] f64;`, answers: [["as"]], explain: "`as` converts a value to another type." }
    ]
  },

  // ─────────────────────────────────────────────────────────── Mini project
  project: {
    title: "Ferris Café Receipt",
    tagline: "Build a program that prints a real café receipt.",
    brief: "Ferris runs a small café. Ferris needs a program that prints a receipt for each order. You will build it step by step. Use only what you learned in this module: variables, types, math and `println!`.",
    starter: `fn main() {
    // Ferris Café receipt
    // Build it one milestone at a time.

}`,
    milestones: [
      {
        title: "The header",
        task: "Store the café name in a variable called `shop`, with the value `\"Ferris Café\"`. Print it like this:\n`=== Ferris Café ===`",
        check: { success: true, stdoutIncludes: ["=== Ferris Café ==="], codeRegex: ["let\\s+shop\\s*="] },
        hints: ["`let shop = \"Ferris Café\";`", "`println!(\"=== {shop} ===\");`"]
      },
      {
        title: "Items and prices",
        task: "Make variables for three items. Each item needs a **price** (`f64`) and a **quantity** (`u32`):\n- Coffee: 3.50, quantity 2\n- Croissant: 2.25, quantity 3\n- Juice: 4.00, quantity 1\n\nPrint one line per item, like `2 x Coffee @ 3.50`.",
        check: { success: true, stdoutIncludes: ["2 x Coffee @ 3.50", "3 x Croissant @ 2.25", "1 x Juice @ 4.00"], codeRegex: [":\\s*u32", "3\\.5"] },
        hints: ["`let coffee_price = 3.50;` and `let coffee_qty: u32 = 2;`", "Print with 2 decimals: `println!(\"{coffee_qty} x Coffee @ {coffee_price:.2}\");`"]
      },
      {
        title: "Line totals",
        task: "Add the cost of each line to the end. The cost is price × quantity. You will need `as`, because quantity is a `u32`.\nExample: `2 x Coffee @ 3.50 = 7.00`",
        check: { success: true, stdoutIncludes: ["2 x Coffee @ 3.50 = 7.00", "3 x Croissant @ 2.25 = 6.75", "1 x Juice @ 4.00 = 4.00"], codeRegex: ["as\\s+f64"] },
        hints: ["`let coffee_cost = coffee_price * coffee_qty as f64;`", "Then print `= {coffee_cost:.2}` at the end of the line."]
      },
      {
        title: "Subtotal, tax and total",
        task: "Add all line costs into a `subtotal`. Tax is 8% of the subtotal. Print three more lines:\n`Subtotal: 17.75`\n`Tax: 1.42`\n`Total: 19.17`",
        check: { success: true, stdoutIncludes: ["Subtotal: 17.75", "Tax: 1.42", "Total: 19.17"], codeRegex: ["0?\\.08"] },
        hints: ["`let subtotal = coffee_cost + croissant_cost + juice_cost;`", "8% as a number is `0.08`: `let tax = subtotal * 0.08;`", "`let total = subtotal + tax;` and print each with `:.2`."]
      },
      {
        title: "Make it yours (bonus)",
        task: "Make the receipt your own. Some ideas:\n- Add a line of dashes `----` between parts\n- Add a fourth item\n- Print a thank-you message at the end\n\nThe check passes when your receipt has **at least 8 lines** and still compiles.",
        check: { success: true, minLines: 8 },
        hints: ["`println!(\"--------------------\");`", "`println!(\"Thank you! Come again 🦀\");`"]
      }
    ],
    solution: `fn main() {
    let shop = "Ferris Café";

    let coffee_price = 3.50;
    let coffee_qty: u32 = 2;
    let croissant_price = 2.25;
    let croissant_qty: u32 = 3;
    let juice_price = 4.00;
    let juice_qty: u32 = 1;

    let coffee_cost = coffee_price * coffee_qty as f64;
    let croissant_cost = croissant_price * croissant_qty as f64;
    let juice_cost = juice_price * juice_qty as f64;

    let subtotal = coffee_cost + croissant_cost + juice_cost;
    let tax = subtotal * 0.08;
    let total = subtotal + tax;

    println!("=== {shop} ===");
    println!("{coffee_qty} x Coffee @ {coffee_price:.2} = {coffee_cost:.2}");
    println!("{croissant_qty} x Croissant @ {croissant_price:.2} = {croissant_cost:.2}");
    println!("{juice_qty} x Juice @ {juice_price:.2} = {juice_cost:.2}");
    println!("--------------------");
    println!("Subtotal: {subtotal:.2}");
    println!("Tax: {tax:.2}");
    println!("Total: {total:.2}");
    println!("Thank you! Come again 🦀");
}`
  }
};
