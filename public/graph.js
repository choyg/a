function graph(canvas) {
  const vertexCount = 100;
  const renderer = canvas.getContext('2d');
  canvas.height = window.innerHeight - 50;
  canvas.width = window.innerWidth - 50;

  const graph = generateVertices(vertexCount, canvas.width, canvas.height);
  generateEdges(graph);
  renderGraph(renderer, graph);
  // Start and ending vertices
  const startKey = Math.floor(Math.random() * Object.keys(graph).length);
  const endKey = Math.floor(Math.random() * Object.keys(graph).length);
  const start = graph[startKey];
  const end = graph[endKey];
  renderer.fillStyle = 'red';
  renderer.fillRect(start.x - 5, start.y - 5, 10, 10);
  renderer.fillRect(end.x - 5, end.y - 5, 10, 10);
  return { graph, startKey, endKey };

  function renderGraph(renderer, vertices) {
    renderer.fillStyle = 'black';
    renderer.strokeStyle = 'grey';
    Object.keys(vertices).forEach(vertex => {
      vertices[vertex].vertices.forEach(key => {
        const v = vertices[key];
        renderer.beginPath();
        renderer.moveTo(vertices[vertex].x, vertices[vertex].y);
        renderer.lineTo(v.x, v.y);
        renderer.stroke();
      });
    });
    Object.keys(vertices).forEach(v =>
      renderer.fillRect(vertices[v].x - 5, vertices[v].y - 5, 10, 10)
    );
  }

  /**
   * @param {number} count Number of vertices to generate
   * @param {number} width Width of canvas
   * @param {number} height Height of canvas
   * @returns {Map} vertices Map of Vertex objects
   */
  function generateVertices(count, width, height) {
    const vertices = {};
    for (let i = 0; i < count; i++) {
      vertices[i] = {};
      vertices[i]['x'] = Math.random() * width;
      vertices[i]['y'] = Math.random() * height;
      vertices[i]['vertices'] = [];
    }
    return vertices;
  }

  /**
   * Generates edges for given array of Vertex objects. Mutates an existing map
   * @param {Map} vertices Map of Vertex objects
   */
  function generateEdges(vertices) {
    Object.keys(vertices).forEach((v1Key, v1) => {
      Object.keys(vertices).forEach((v2Key, v2) => {
        // Prob of a vertex depends on dist
        if (dist(vertices[v1Key], vertices[v2Key]) < 200 && Math.random() < 0.4) {
          vertices[v2Key].vertices.push(v1Key);
          vertices[v1Key].vertices.push(v2Key);
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
    .post('/graph', JSON.stringify({ vertexMap: graph, source, dest }))
    .then(response => {
      const path = response.data;
      console.log(path);
    })
    .catch(err => console.error(err));
}
