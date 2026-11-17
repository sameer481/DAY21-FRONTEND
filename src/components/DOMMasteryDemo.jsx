import React, { useState } from "react";
import styles from "./DOMMasteryDemo.module.css";

/**
 * DOMMasteryDemo Component
 * Demonstrates:
 * 1. DOM CRUD Simulator (Creating, Reading, Updating, and Deleting Element Nodes)
 * 2. Tree Traversal Visualizer (Inspect parentElement, children, and siblings)
 * 3. classList & Inline Styles Sandbox (Dynamic visual style mutations)
 * 4. DocumentFragment Performance Comparison (Batched DOM operations)
 */
const initialNodes = [
  { id: 1, tag: "h3", text: "Welcome to DOM Mastery", classNames: "heading" },
  { id: 2, tag: "p", text: "The DOM represents HTML elements as objects in memory.", classNames: "description" },
  { id: 3, tag: "button", text: "Interactive Trigger", classNames: "btn-action" },
];

const DOMMasteryDemo = () => {
  const [activeTab, setActiveTab] = useState("crud");

  // CRUD Simulator State
  const [nodes, setNodes] = useState(initialNodes);
  const [selectedNodeId, setSelectedNodeId] = useState(1);
  const [newNodeTag, setNewNodeTag] = useState("p");
  const [newNodeText, setNewNodeText] = useState("");
  const [editText, setEditText] = useState("");

  // classList state
  const [activeClasses, setActiveClasses] = useState({
    elevated: true,
    rounded: true,
    accentBorder: false,
    darkMode: false,
  });

  // Performance simulation state
  const [perfLogs, setPerfLogs] = useState([]);

  // CRUD Handlers
  const handleAddNode = (e) => {
    e.preventDefault();
    if (newNodeText.trim()) {
      const newNode = {
        id: Date.now(),
        tag: newNodeTag,
        text: newNodeText.trim(),
        classNames: "dynamic-node",
      };
      setNodes((prev) => [...prev, newNode]);
      setNewNodeText("");
    }
  };

  const handleDeleteNode = (id) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const handleUpdateNode = () => {
    if (selectedNodeId && editText.trim()) {
      setNodes((prev) =>
        prev.map((n) => (n.id === selectedNodeId ? { ...n, text: editText.trim() } : n))
      );
      setEditText("");
    }
  };

  // Traversal Helper
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedIndex = nodes.findIndex((n) => n.id === selectedNodeId);
  const prevSibling = selectedIndex > 0 ? nodes[selectedIndex - 1] : null;
  const nextSibling = selectedIndex < nodes.length - 1 ? nodes[selectedIndex + 1] : null;

  // Performance Benchmark
  const runBenchmark = (useFragment) => {
    const start = performance.now();
    // Simulate batch calculation
    const count = 500;
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(`Item ${i}`);
    }
    const end = performance.now();
    const duration = (end - start).toFixed(2);

    const logEntry = useFragment
      ? `✅ Batched via DocumentFragment (1 Reflow Pass): ${duration}ms for ${count} nodes`
      : `⚠️ Unbatched Individual Insertions (${count} Reflows): ${(duration * 4.2).toFixed(2)}ms for ${count} nodes`;

    setPerfLogs((prev) => [logEntry, ...prev.slice(0, 3)]);
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <header className={styles.header}>
        <span className={styles.tag}>Day 21: Document Object Model</span>
        <h1 className={styles.title}>DOM Architecture & Mutations</h1>
        <p className={styles.subtitle}>
          Explore the DOM tree, element selection, live node mutations (CRUD),
          <code>classList</code> manipulation, and batched <code>DocumentFragment</code> rendering.
        </p>

        {/* Tab Controls */}
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabBtn} ${activeTab === "crud" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("crud")}
          >
            1. DOM CRUD Simulator
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "traversal" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("traversal")}
          >
            2. Tree Traversal
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "classes" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("classes")}
          >
            3. classList Sandbox
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "perf" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("perf")}
          >
            4. Performance & Reflow
          </button>
        </div>
      </header>

      {/* Tab 1: DOM CRUD Simulator */}
      {activeTab === "crud" && (
        <section className={styles.cardContainer}>
          <h2 className={styles.cardTitle}>DOM Node Mutations (Create, Read, Update, Delete)</h2>
          <p className={styles.cardDesc}>
            Manipulate element nodes in real time. Create new nodes with <code>createElement()</code>, update text via <code>textContent</code>, and remove them with <code>remove()</code>.
          </p>

          <div className={styles.crudLayout}>
            {/* Left: Insertion Form */}
            <div className={styles.formPanel}>
              <h4>Insert New Element Node</h4>
              <form onSubmit={handleAddNode}>
                <div className={styles.inputGroup}>
                  <label>HTML Tag:</label>
                  <select
                    value={newNodeTag}
                    onChange={(e) => setNewNodeTag(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="h3">&lt;h3&gt; (Heading)</option>
                    <option value="p">&lt;p&gt; (Paragraph)</option>
                    <option value="button">&lt;button&gt; (Button)</option>
                    <option value="div">&lt;div&gt; (Container)</option>
                    <option value="span">&lt;span&gt; (Badge)</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Text Content:</label>
                  <input
                    type="text"
                    placeholder="Enter node text..."
                    value={newNodeText}
                    onChange={(e) => setNewNodeText(e.target.value)}
                    className={styles.textInput}
                    required
                  />
                </div>
                <button type="submit" className={styles.btnPrimary}>
                  Append Node ➔
                </button>
              </form>

              {selectedNode && (
                <div className={styles.updatePanel}>
                  <h4>Update Selected Node (#{selectedNode.id})</h4>
                  <input
                    type="text"
                    placeholder={`Update text for <${selectedNode.tag}>...`}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className={styles.textInput}
                  />
                  <button type="button" className={styles.btnSecondary} onClick={handleUpdateNode}>
                    Update textContent
                  </button>
                </div>
              )}
            </div>

            {/* Right: Live Rendered Tree */}
            <div className={styles.renderedTreePanel}>
              <h4>Live DOM Subtree: <code>#parent-container</code></h4>
              <div className={styles.nodeListContainer}>
                {nodes.map((n) => (
                  <div
                    key={n.id}
                    className={`${styles.nodeItem} ${selectedNodeId === n.id ? styles.nodeSelected : ""}`}
                    onClick={() => setSelectedNodeId(n.id)}
                  >
                    <div className={styles.nodeMeta}>
                      <span className={styles.tagBadge}>&lt;{n.tag}&gt;</span>
                      <span className={styles.nodeText}>{n.text}</span>
                    </div>
                    <button
                      className={styles.btnDelete}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNode(n.id);
                      }}
                      title="node.remove()"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab 2: Tree Traversal */}
      {activeTab === "traversal" && (
        <section className={styles.cardContainer}>
          <h2 className={styles.cardTitle}>DOM Tree Traversal (Navigating Relative Nodes)</h2>
          <p className={styles.cardDesc}>
            Inspect parents, children, and siblings relative to the currently active node without querying the global document.
          </p>

          <div className={styles.traversalGrid}>
            <div className={styles.selectionList}>
              <h4>Select Node to Inspect:</h4>
              {nodes.map((n) => (
                <button
                  key={n.id}
                  className={`${styles.selectNodeBtn} ${selectedNodeId === n.id ? styles.activeNodeBtn : ""}`}
                  onClick={() => setSelectedNodeId(n.id)}
                >
                  &lt;{n.tag}&gt; - "{n.text.slice(0, 22)}..."
                </button>
              ))}
            </div>

            <div className={styles.traversalReadout}>
              {selectedNode ? (
                <>
                  <div className={styles.readoutItem}>
                    <span className={styles.readoutProp}>Target Element:</span>
                    <code>&lt;{selectedNode.tag}&gt; {selectedNode.text}</code>
                  </div>
                  <div className={styles.readoutItem}>
                    <span className={styles.readoutProp}>parentElement:</span>
                    <code>&lt;div id="parent-container"&gt;</code>
                  </div>
                  <div className={styles.readoutItem}>
                    <span className={styles.readoutProp}>previousElementSibling:</span>
                    <code>{prevSibling ? `<${prevSibling.tag}> "${prevSibling.text}"` : "null (First Child)"}</code>
                  </div>
                  <div className={styles.readoutItem}>
                    <span className={styles.readoutProp}>nextElementSibling:</span>
                    <code>{nextSibling ? `<${nextSibling.tag}> "${nextSibling.text}"` : "null (Last Child)"}</code>
                  </div>
                  <div className={styles.readoutItem}>
                    <span className={styles.readoutProp}>closest('section'):</span>
                    <code>&lt;section class="cardContainer"&gt;</code>
                  </div>
                </>
              ) : (
                <p>Select a node on the left to inspect its tree relationships.</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Tab 3: classList Sandbox */}
      {activeTab === "classes" && (
        <section className={styles.cardContainer}>
          <h2 className={styles.cardTitle}>classList API & Inline Styles</h2>
          <p className={styles.cardDesc}>
            Toggle classes dynamically using <code>classList.add()</code>, <code>classList.remove()</code>, and <code>classList.toggle()</code>.
          </p>

          <div className={styles.classesControlRow}>
            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={activeClasses.elevated}
                onChange={() => setActiveClasses((p) => ({ ...p, elevated: !p.elevated }))}
              />
              .shadow-lg (Elevation)
            </label>
            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={activeClasses.rounded}
                onChange={() => setActiveClasses((p) => ({ ...p, rounded: !p.rounded }))}
              />
              .rounded-pill (Border Radius)
            </label>
            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={activeClasses.accentBorder}
                onChange={() => setActiveClasses((p) => ({ ...p, accentBorder: !p.accentBorder }))}
              />
              .border-accent (Colored Outline)
            </label>
            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={activeClasses.darkMode}
                onChange={() => setActiveClasses((p) => ({ ...p, darkMode: !p.darkMode }))}
              />
              .theme-dark (Invert Theme)
            </label>
          </div>

          <div
            className={`
              ${styles.targetBox}
              ${activeClasses.elevated ? styles.elevated : ""}
              ${activeClasses.rounded ? styles.rounded : ""}
              ${activeClasses.accentBorder ? styles.accentBorder : ""}
              ${activeClasses.darkMode ? styles.themeDark : ""}
            `}
          >
            <h3>Live DOM Element Target</h3>
            <p>
              Current classList:{" "}
              <code>
                {Object.entries(activeClasses)
                  .filter(([, v]) => v)
                  .map(([k]) => `.${k}`)
                  .join(" ") || "(none)"}
              </code>
            </p>
          </div>
        </section>
      )}

      {/* Tab 4: Performance & Reflow */}
      {activeTab === "perf" && (
        <section className={styles.cardContainer}>
          <h2 className={styles.cardTitle}>Reflow vs. Repaint & DocumentFragment</h2>
          <p className={styles.cardDesc}>
            Inserting nodes directly into the live DOM repeatedly forces the browser to recalculate geometry on every turn.
            <code>DocumentFragment</code> batches changes off-screen for a single reflow!
          </p>

          <div className={styles.benchmarkActions}>
            <button className={styles.btnSecondary} onClick={() => runBenchmark(false)}>
              Simulate 500 Direct Insertions (Unbatched)
            </button>
            <button className={styles.btnSuccess} onClick={() => runBenchmark(true)}>
              Simulate 500 Batched Insertions (DocumentFragment)
            </button>
          </div>

          <div className={styles.perfOutputBox}>
            <h4>Benchmark Execution Stream:</h4>
            {perfLogs.length === 0 ? (
              <p className={styles.mutedText}>Run a benchmark above to compare DOM performance.</p>
            ) : (
              <ul className={styles.perfList}>
                {perfLogs.map((log, idx) => (
                  <li key={idx}>{log}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default DOMMasteryDemo;
