class Graph {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    const vertexCount = 1000;
    const graph = generateVertices(vertexCount, canvas.width, canvas.height);
    generateEdges(graph);
    this.graph = graph;
    renderGraph(canvas, graph);
    panhandler(canvas, graph);
    // Start and ending vertices
    const startKey = Math.floor(Math.random() * Object.keys(graph).length);
    const endKey = Math.floor(Math.random() * Object.keys(graph).length);
    this.setStart(graph[startKey]);
    this.setEnd(graph[endKey]);

    function renderGraph(canvas, vertices) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#444';
      ctx.strokeStyle = 'grey';
      ctx.lineWidth = 1;
      Object.keys(vertices).forEach(vertex => {
        vertices[vertex].vertices.forEach(key => {
          const v = vertices[key];
          ctx.beginPath();
          ctx.moveTo(vertices[vertex].x, vertices[vertex].y);
          ctx.lineTo(v.x, v.y);
          ctx.stroke();
        });
      });
      Object.keys(vertices).forEach(v =>
        ctx.fillRect(vertices[v].x - 5, vertices[v].y - 5, 10, 10)
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
        vertices[i] = {
          x: Math.random() * width,
          y: Math.random() * height,
          vertices: [],
          key: i
        };
      }
      return vertices;
    }

    /**
     * Generates edges for given array of Vertex objects. Mutates an existing map
     * @param {Map} vertices Map of Vertex objects
     */
    function generateEdges(vertices) {
      Object.keys(vertices).forEach(v1Key => {
        Object.keys(vertices).forEach(v2Key => {
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

    /**
     *
     * @param {HTMLCanvasElement} canvas
     */
    function panhandler(canvas, graph) {
      let ctx = canvas.getContext('2d');
      let pan = false;
      let previousX = 0;
      let previousY = 0;
      let currentX = 0;
      let currentY = 0;
      let scale = 1;
      canvas.onmousedown = mouseDown;
      canvas.onmouseup = mouseUp;
      canvas.onmousemove = mouseMove;
      canvas.addEventListener('mousewheel', zoom);
      canvas.addEventListener('DOMMouseScroll', zoom);

      function mouseDown() {
        pan = true;
        previousX = event.clientX;
        previousY = event.clientY;
      }
      function mouseUp() {
        pan = false;
      }
      function mouseMove(event) {
        if (!pan) return;
        currentX += event.clientX - previousX;
        currentY += event.clientY - previousY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(scale, 0, 0, scale, currentX, currentY);
        renderGraph(canvas, graph);
        previousX = event.clientX;
        previousY = event.clientY;
      }
      function zoom(event) {
        scale += event.deltaY / -1000;
        scale = Math.max(0.1, scale);
        console.log(scale);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(scale, 0, 0, scale, currentX, currentY);
        renderGraph(canvas, graph);
      }
    }
  }

  getShortestPath() {
    const vertexArray = Object.entries(this.graph).map(arr => arr[1]);
    axios
      .post('/graph', { vertexArray, source: this.start.key, dest: this.end.key })
      .then(response => {
        const path = response.data;
        this.drawPath(path);
      })
      .catch(err => console.error(err));
  }

  /**
   * Draws a path between the given keys. Does not validate for edges.
   * @param {string[]} keys Graph vertex keys
   */
  drawPath(keys) {
    const ctx = this.ctx;
    for (let i = 0; i < keys.length; i++) {
      if (i + 1 >= keys.length) return;
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'yellow';
      ctx.beginPath();
      ctx.moveTo(this.graph[keys[i]].x, this.graph[keys[i]].y);
      ctx.lineTo(this.graph[keys[i + 1]].x, this.graph[keys[i + 1]].y);
      ctx.stroke();
      if (i === 0) continue;
      ctx.fillStyle = 'green';
      ctx.fillRect(this.graph[keys[i]].x - 5, this.graph[keys[i]].y - 5, 10, 10);
    }
  }

  setStart(vertex) {
    this.start = vertex;
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(vertex.x - 5, vertex.y - 5, 10, 10);
  }

  setEnd(vertex) {
    this.end = vertex;
    this.ctx.fillStyle = 'cyan';
    this.ctx.fillRect(vertex.x - 5, vertex.y - 5, 10, 10);
  }
}

