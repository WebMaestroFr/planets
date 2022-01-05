import { useMemo } from "react";
import { Float32BufferAttribute, Vector3 } from "three";

export function useTileGeometry(
  centerVertex: Vector3,
  polygonVertices: Vector3[]
) {
  const computedVertices = useMemo(() => {
    return polygonVertices.reduce<
      {
        position: [number, number, number];
        normal: [number, number, number];
        uv: [number, number];
      }[]
    >((v, vertex, index, vertices) => {
      const nextVertex =
        index === vertices.length - 1 ? vertices[0] : vertices[index + 1];
      const normalBase = vertex
        .clone()
        .add(nextVertex)
        .divideScalar(2)
        .sub(centerVertex)
        .normalize();
      const normalTop = vertex
        .clone()
        .add(nextVertex)
        .add(centerVertex)
        .divideScalar(3)
        .normalize();
      return [
        ...v,
        {
          position: [0, 0, 0],
          normal: [normalBase.x, normalBase.y, normalBase.z],
          uv: [0, 0],
        },
        {
          position: [vertex.x, vertex.y, vertex.z],
          normal: [normalBase.x, normalBase.y, normalBase.z],
          uv: [0, 1],
        },
        {
          position: [nextVertex.x, nextVertex.y, nextVertex.z],
          normal: [normalBase.x, normalBase.y, normalBase.z],
          uv: [1, 0],
        },
        {
          position: [centerVertex.x, centerVertex.y, centerVertex.z],
          normal: [normalTop.x, normalTop.y, normalTop.z],
          uv: [1, 1],
        },
        {
          position: [nextVertex.x, nextVertex.y, nextVertex.z],
          normal: [normalTop.x, normalTop.y, normalTop.z],
          uv: [1, 0],
        },
        {
          position: [vertex.x, vertex.y, vertex.z],
          normal: [normalTop.x, normalTop.y, normalTop.z],
          uv: [0, 1],
        },
      ];
    }, []);
  }, [centerVertex, polygonVertices]);

  const positions = useMemo(() => {
    const attribute = computedVertices.reduce<number[]>(
      (coordinates, vertex) => {
        coordinates.push(...vertex.position);
        return coordinates;
      },
      []
    );
    return new Float32BufferAttribute(attribute, 3);
  }, [computedVertices]);
  const normals = useMemo(() => {
    const attribute = computedVertices.reduce<number[]>((normals, vertex) => {
      normals.push(...vertex.normal);
      return normals;
    }, []);
    return new Float32BufferAttribute(attribute, 3);
  }, [computedVertices]);
  const uvs = useMemo(() => {
    const attribute = computedVertices.reduce<number[]>((uvs, vertex) => {
      uvs.push(...vertex.uv);
      return uvs;
    }, []);
    return new Float32BufferAttribute(attribute, 2);
  }, [computedVertices]);

  return { positions, normals, uvs };
}
