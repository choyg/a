function graph(canvas) {
  const vertexCount = 100;
  const renderer = canvas.getContext('2d');
  canvas.height = window.innerHeight - 50;
  canvas.width = window.innerWidth - 50;

  const graph = generateVertices(vertexCount, canvas.width, canvas.height);
  generateEdges(graph);
  renderGraph(renderer, graph);
  // Start and ending vertices
  const startKey = Math.floor(Math.random() * graph.size);
  const endKey = Math.floor(Math.random() * graph.size);
  const start = graph.get(startKey);
  const end = graph.get(endKey);
  renderer.fillStyle = 'red';
  renderer.fillRect(start.x - 5, start.y - 5, 10, 10);
  renderer.fillRect(end.x - 5, end.y - 5, 10, 10);
  return { graph, startKey, endKey };

  function renderGraph(renderer, vertices) {
    renderer.fillStyle = 'black';
    renderer.strokeStyle = 'grey';
    vertices.forEach(vertex => {
      vertex.vertices.forEach(key => {
        const v = vertices.get(key);
        renderer.beginPath();
        renderer.moveTo(vertex.x, vertex.y);
        renderer.lineTo(v.x, v.y);
        renderer.stroke();
      });
    });
    vertices.forEach(v => renderer.fillRect(v.x - 5, v.y - 5, 10, 10));
  }

  /**
   * @param {number} count Number of vertices to generate
   * @param {number} width Width of canvas
   * @param {number} height Height of canvas
   * @returns {Map} vertices Map of Vertex objects
   */
  function generateVertices(count, width, height) {
    const vertices = new Map();
    for (let i = 0; i < count; i++) {
      vertices.set(i, {
        x: Math.random() * width,
        y: Math.random() * height,
        vertices: []
      });
    }
    return vertices;
  }

  /**
   * Generates edges for given array of Vertex objects. Mutates an existing map
   * @param {Map} vertices Map of Vertex objects
   */
  function generateEdges(vertices) {
    vertices.forEach((v1, v1Key) => {
      vertices.forEach((v2, v2Key) => {
        // Prob of a vertex depends on dist
        if (dist(v1, v2) < 200 && Math.random() < 0.4) {
          v2.vertices.push(v1Key);
          v1.vertices.push(v2Key);
        }
      });
    });
  }

  /**
   * Distance Formula
   * @param {Vertex} a
   * @param {Vertex} b
   * @returns {number} Distance between points a and b
   */
  function dist(a, b) {
    return Math.sqrt(Math.pow(b.y - a.y, 2) + Math.pow(b.x - a.x, 2));
  }
}

/**
 *
 * @param {*} graph
 * @param {*} source
 * @param {*} dest
 */
function getShortestPath(graph, source, dest) {
  axios
    .post('/graph', { vertexMap: graph, source, dest })
    .then(response => {
      const path = response.data;
      console.log(path);
    })
    .catch(err => console.error(err));
}
