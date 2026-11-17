/**
 * Day 21: Document Object Model (DOM) Executable Reference
 * Run directly with: node dom.js
 */

console.log("==========================================");
console.log("🌳 DAY 21: JAVASCRIPT DOM REFERENCE");
console.log("==========================================\n");

// 1. DOM NODE TYPES CONSTANTS & CLASSIFICATION
console.log("--- 1. DOM NODE TYPES CLASSIFICATION ---");
const NODE_TYPES = {
  ELEMENT_NODE: 1,      // <div>, <p>, <span>
  ATTRIBUTE_NODE: 2,    // class="card" (historical)
  TEXT_NODE: 3,         // Text content & whitespace
  COMMENT_NODE: 8,      // <!-- comment -->
  DOCUMENT_NODE: 9,     // window.document
  DOCUMENT_FRAGMENT: 11 // DocumentFragment
};

console.log("Node Types Matrix:", NODE_TYPES);

// 2. SIMULATING A DOM TREE STRUCTURE
console.log("\n--- 2. DOM TREE HIERARCHY SIMULATION ---");

class MockElement {
  constructor(tagName, attributes = {}, textContent = "") {
    this.nodeType = 1;
    this.tagName = tagName.toUpperCase();
    this.attributes = { ...attributes };
    this.textContent = textContent;
    this.children = [];
    this.parentElement = null;
    this.classList = new Set(attributes.class ? attributes.class.split(" ") : []);
  }

  append(child) {
    child.parentElement = this;
    this.children.push(child);
  }

  getAttribute(key) {
    return this.attributes[key] || null;
  }

  setAttribute(key, value) {
    this.attributes[key] = value;
    if (key === "class") {
      this.classList = new Set(value.split(" "));
    }
  }

  addClass(className) {
    this.classList.add(className);
    this.attributes.class = Array.from(this.classList).join(" ");
  }

  removeClass(className) {
    this.classList.delete(className);
    this.attributes.class = Array.from(this.classList).join(" ");
  }

  // Traversal: Find closest ancestor matching tag
  closest(tagName) {
    let current = this.parentElement;
    const targetTag = tagName.toUpperCase();
    while (current) {
      if (current.tagName === targetTag) return current;
      current = current.parentElement;
    }
    return null;
  }
}

// Construct a sample DOM subtree:
const container = new MockElement("div", { id: "app-root", class: "container p-4" });
const card = new MockElement("section", { class: "card shadow-sm" });
const heading = new MockElement("h2", {}, "DOM Tree Navigation");
const paragraph = new MockElement("p", { class: "text-muted" }, "Learning Document Object Model");

card.append(heading);
card.append(paragraph);
container.append(card);

console.log(`Root: <${container.tagName} id="${container.attributes.id}" class="${container.attributes.class}">`);
console.log(`  └─ Child: <${card.tagName} class="${card.attributes.class}">`);
console.log(`       ├─ Sub-Child: <${heading.tagName}>${heading.textContent}</${heading.tagName}>`);
console.log(`       └─ Sub-Child: <${paragraph.tagName}>${paragraph.textContent}</${paragraph.tagName}>`);

// Test closest() traversal:
const foundContainer = heading.closest("div");
console.log(`\nTraversal Test: heading.closest('div') => <${foundContainer.tagName} id="${foundContainer.attributes.id}">`);

// 3. CLASSLIST API DEMO
console.log("\n--- 3. CLASSLIST API DEMONSTRATION ---");
card.addClass("border-primary");
console.log("After addClass('border-primary'):", card.attributes.class);
card.removeClass("shadow-sm");
console.log("After removeClass('shadow-sm'):", card.attributes.class);
console.log("classList.has('border-primary'):", card.classList.has("border-primary"));

// 4. BATCHING MUTATIONS: DOCUMENTFRAGMENT SIMULATION
console.log("\n--- 4. BATCHING MUTATIONS WITH DOCUMENTFRAGMENT ---");

class MockDocumentFragment {
  constructor() {
    this.nodeType = 11;
    this.children = [];
  }
  append(child) {
    this.children.push(child);
  }
}

// Without Fragment: Multiple simulated reflows
let reflowCount = 0;
const listUnoptimized = new MockElement("ul");
for (let i = 1; i <= 3; i++) {
  reflowCount++; // Each direct insertion triggers layout calculation
  listUnoptimized.append(new MockElement("li", {}, `Item ${i}`));
}
console.log(`Unoptimized insertion of 3 items triggered ${reflowCount} layout passes.`);

// With Fragment: Single reflow batch
reflowCount = 0;
const listOptimized = new MockElement("ul");
const fragment = new MockDocumentFragment();
for (let i = 1; i <= 3; i++) {
  fragment.append(new MockElement("li", {}, `Item ${i}`));
}
// One single append operation into live tree
listOptimized.children.push(...fragment.children);
reflowCount++;
console.log(`Optimized DocumentFragment insertion triggered only ${reflowCount} layout pass for all items! ✅`);

// 5. TEXTCONTENT VS INNERHTML (XSS SANITIZATION PRINCIPLE)
console.log("\n--- 5. XSS SANITIZATION (TEXTCONTENT VS INNERHTML) ---");
const untrustedUserInput = "<img src='x' onerror='alert(\"Hacked!\")' /> Safe Content";

console.log("Untrusted Input:", untrustedUserInput);
console.log("1. innerHTML: Would execute malicious script payload! ⚠️");
console.log("2. textContent: Escapes markup safely, treating it as raw string text ✅");

console.log("\n==========================================");
console.log("✅ All DOM architectural tests completed!");
console.log("==========================================");
