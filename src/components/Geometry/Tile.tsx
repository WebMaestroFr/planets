import { FC, useMemo } from "react";
import { BufferGeometryProps, useUpdate } from "react-three-fiber";
import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";

const GeometryTile: FC<
  BufferGeometryProps & {
    tileCenter: Vector3;
    tilePolygon: Vector3[];
  }
> = ({ tileCenter, tilePolygon, ...props }) => {
  const vertices = useMemo(
    () =>
      tilePolygon.reduce<
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
          .sub(tileCenter)
          .normalize();
        const normalTop = vertex
          .clone()
          .add(nextVertex)
          .add(tileCenter)
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
            position: [tileCenter.x, tileCenter.y, tileCenter.z],
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
      }, []),
    [tileCenter, tilePolygon]
  );

  const positionsAttribute = useMemo(() => {
    const positions = vertices.reduce<number[]>((coordinates, vertex) => {
      coordinates.push(...vertex.position);
      return coordinates;
    }, []);
    return new Float32BufferAttribute(positions, 3);
  }, [vertices]);
  const normalsAttribute = useMemo(() => {
    const normals = vertices.reduce<number[]>((normals, vertex) => {
      normals.push(...vertex.normal);
      return normals;
    }, []);
    return new Float32BufferAttribute(normals, 3);
  }, [vertices]);
  const uvsAttribute = useMemo(() => {
    const uvs = vertices.reduce<number[]>((uvs, vertex) => {
      uvs.push(...vertex.uv);
      return uvs;
    }, []);
    return new Float32BufferAttribute(uvs, 2);
  }, [vertices]);

  const ref = useUpdate<BufferGeometry>(
    (geometry) => {
      geometry.setAttribute("position", positionsAttribute);
      geometry.setAttribute("normal", normalsAttribute);
      geometry.setAttribute("uv", uvsAttribute);
    },
    [positionsAttribute, normalsAttribute, uvsAttribute]
  );

  return <bufferGeometry ref={ref} {...props} />;
};

export default GeometryTile;
