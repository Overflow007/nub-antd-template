export default function myForce(nodes, links) {
  // let ;
  const distanceMin2 = 1;
  const distanceMax2 = Infinity;
  const f = 700;

  const nodeWeight = {};
  const linkCache = {};

  links.forEach(item => {
    const { source, target } = item;
    linkCache[source] = linkCache[source] || {};
    linkCache[source][target] = 1;
    nodeWeight[source] = (nodeWeight[source] || 0.5) + 0.05;
    nodeWeight[target] = (nodeWeight[target] || 0.5) + 0.05;
  });

  function isLink(node1, node2) {
    return (
      (linkCache[node1.id] && linkCache[node1.id][node2.id]) ||
      (linkCache[node2.id] && linkCache[node2.id][node1.id])
    );
  }

  function initialize() {
    if (!nodes) return;
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
    }
  }

  function distance2(node1, node2) {
    return (node1.x - node2.x) * (node1.x - node2.x) + (node1.y - node2.y) * (node1.y - node2.y);
  }

  function inDistance(node1, node2) {
    const distance = 10000;
    return distance2(node1, node2) < distance;
  }

  function force(_) {
    nodes[0].vx = -0.1 * nodes[0].x;
    nodes[0].vy = -0.1 * nodes[0].y;
    for (let i = 0, k = 0.1 * _; i < nodes.length; i += 1) {
      const node1 = nodes[i];
      if (i > 0) {
        node1.vx += 1 / node1.x * k;
        node1.vy += 1 / node1.y * k;
      }

      for (let j = i + 1; j < nodes.length; j += 1) {
        const node2 = nodes[j];
        const distance = distance2(node1, node2);
        const d = Math.sqrt(distance);

        if (d && d < 400) {
          const linkStrength = 1;
          const nodeStrength = 35;
          const fx = f / distance * (node1.x - node2.x) * k;
          const fy = f / distance * (node1.y - node2.y) * k;
          const hoverF1 = node1.hover ? 1 : 1;
          const hoverF2 = node2.hover ? 1 : 1;

          if (isLink(node1, node2)) {
            if (i > 0) {
              node1.vx += linkStrength * nodeWeight[node2.id] * fx * hoverF2;
              node1.vy += linkStrength * nodeWeight[node2.id] * fy * hoverF2;
            }
            node2.vx -= linkStrength * nodeWeight[node1.id] * fx * hoverF1;
            node2.vy -= linkStrength * nodeWeight[node1.id] * fy * hoverF1;
          } else {
            if (i > 0) {
              node1.vx += nodeStrength * fx;
              node1.vy += nodeStrength * fy;
            }
            node2.vx -= nodeStrength * fx;
            node2.vy -= nodeStrength * fy;
          }
        }
      }
    }
  }

  force.initialize = function (_) {
    // nodes = _;
    initialize();
  };

  return force;
}
