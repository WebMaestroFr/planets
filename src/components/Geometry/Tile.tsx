import { FC, useMemo } from "react";
import { BufferGeometryProps, useUpdate } from "react-three-fiber";
import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";

const GeometryTile: FC<
  BufferGeometryProps & {
    tileCenter: Vector3;
    tilePolygon: Vector3[];
  }
> = ({ tileCenter, tilePolygon, ...props }) => {
  const vertices = useMemo(() => {
    const centerNormal = tileCenter.clone().normalize();
    const baseNormals = tilePolygon.map((vertex) =>
      vertex.clone().sub(tileCenter).normalize()
    );
    const topNormals = tilePolygon.map((vertex) => vertex.clone().normalize());
    return tilePolygon.reduce<
      {
        position: [number, number, number];
        normal: [number, number, number];
        uv: [number, number];
      }[]
    >((v, vertex, index, vertices) => {
      const nextIndex = index === vertices.length - 1 ? 0 : index + 1;
      return [
        ...v,
        {
          position: [0, 0, 0],
          normal: [-centerNormal.x, -centerNormal.y, -centerNormal.z],
          uv: [0, 0],
        },
        {
          position: [vertex.x, vertex.y, vertex.z],
          normal: [
            baseNormals[index].x,
            baseNormals[index].y,
            baseNormals[index].z,
          ],
          uv: [0, 1],
        },
        {
          position: [
            vertices[nextIndex].x,
            vertices[nextIndex].y,
            vertices[nextIndex].z,
          ],
          normal: [
            baseNormals[nextIndex].x,
            baseNormals[nextIndex].y,
            baseNormals[nextIndex].z,
          ],
          uv: [1, 0],
        },
        {
          position: [tileCenter.x, tileCenter.y, tileCenter.z],
          normal: [centerNormal.x, centerNormal.y, centerNormal.z],
          uv: [1, 1],
        },
        {
          position: [
            vertices[nextIndex].x,
            vertices[nextIndex].y,
            vertices[nextIndex].z,
          ],
          normal: [
            topNormals[nextIndex].x,
            topNormals[nextIndex].y,
            topNormals[nextIndex].z,
          ],
          uv: [1, 0],
        },
        {
          position: [vertex.x, vertex.y, vertex.z],
          normal: [
            topNormals[index].x,
            topNormals[index].y,
            topNormals[index].z,
          ],
          uv: [0, 1],
        },
      ];
    }, []);
  }, [tileCenter, tilePolygon]);

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
