// The full roadmap. `icon` is a Phosphor icon name (phosphoricons.com). Modules with `ready: true` have content in js/modules/.
window.COURSE = {
  title: "Rust: Beginner to Expert",
  clusters: [
    {
      id: "c1",
      title: "Foundations",
      blurb: "Learn to read and write simple Rust. Meet the compiler and make it your friend.",
      modules: [
        { id: "m01", title: "First Steps", icon: "footprints", blurb: "Programs, Cargo, variables and basic types.", ready: true },
        { id: "m02", title: "Control Flow & Functions", icon: "git-branch", blurb: "if, loops, and writing your own functions." },
        { id: "m03", title: "Ownership & Borrowing", icon: "key", blurb: "Rust's big idea: who owns a value, and who may use it." },
        { id: "m04", title: "Structs, Enums & Match", icon: "puzzle-piece", blurb: "Model your own data and handle every case." }
      ],
      project: { id: "p1", title: "Cluster project: Text Adventure", blurb: "A playable terminal game with rooms, items and choices." }
    },
    {
      id: "c2",
      title: "Building Real Programs",
      blurb: "Collections, errors, crates and tests. The tools of everyday Rust.",
      modules: [
        { id: "m05", title: "Collections", icon: "stack", blurb: "Vec, String and HashMap." },
        { id: "m06", title: "Error Handling", icon: "lifebuoy", blurb: "Result, Option and the ? operator." },
        { id: "m07", title: "Modules & Crates", icon: "folders", blurb: "Organize code and use other people's libraries." },
        { id: "m08", title: "Testing", icon: "test-tube", blurb: "Prove your code works, and keep it working." }
      ],
      project: { id: "p2", title: "Cluster project: minigrep", blurb: "A real command-line tool that searches files." }
    },
    {
      id: "c3",
      title: "Abstraction",
      blurb: "Write code once and use it for many types. Think like a Rustacean.",
      modules: [
        { id: "m09", title: "Generics & Traits", icon: "dna", blurb: "Shared behavior across types." },
        { id: "m10", title: "Lifetimes", icon: "hourglass-medium", blurb: "How long references live, made simple." },
        { id: "m11", title: "Closures & Iterators", icon: "repeat", blurb: "Functional power with zero cost." },
        { id: "m12", title: "Smart Pointers", icon: "hand-pointing", blurb: "Box, Rc, RefCell and friends." }
      ],
      project: { id: "p3", title: "Cluster project: JSON Parser", blurb: "Parse real JSON into Rust data, from scratch." }
    },
    {
      id: "c4",
      title: "Concurrency & Systems",
      blurb: "Do many things at once, safely. Talk to the network.",
      modules: [
        { id: "m13", title: "Threads & Channels", icon: "arrows-split", blurb: "Fearless concurrency in practice." },
        { id: "m14", title: "Async Rust", icon: "lightning", blurb: "Futures, async/await and Tokio." },
        { id: "m15", title: "Networking", icon: "globe-hemisphere-west", blurb: "TCP, HTTP and building services." }
      ],
      project: { id: "p4", title: "Cluster project: Multi-threaded Web Server", blurb: "Serve web pages with a thread pool you build." }
    },
    {
      id: "c5",
      title: "Mastery",
      blurb: "The deep end. Understand what Rust does under the hood.",
      modules: [
        { id: "m16", title: "Unsafe & FFI", icon: "radioactive", blurb: "When and how to step outside the guard rails." },
        { id: "m17", title: "Macros", icon: "magic-wand", blurb: "Write code that writes code." },
        { id: "m18", title: "Performance", icon: "gauge", blurb: "Profile, measure and make it fast." },
        { id: "m19", title: "Rust + WebAssembly", icon: "browser", blurb: "Run Rust in the browser." }
      ],
      project: { id: "p5", title: "Capstone: Build Your Own Redis", blurb: "A real key-value database server, end to end." }
    }
  ]
};
window.MODULES = window.MODULES || {};
