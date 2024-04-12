// jscad-io.d.ts
declare module '@jscad/io' {
  // Define a generic type for serializers
  type Serializer = {
    serialize: (options: any, ...objects?: any) => Array;
  };

  // Define a generic type for deserializers
  type Deserializer = {
    deserialize: (rawData: string | ArrayBuffer, options?: any) => any;
  };

  export const makeBlob: (content: string | BlobPart[], options?: BlobPropertyBag) => Blob;
  export const solidsAsBlob: (solids: any, options?: any) => Blob;
  export const amfSerializer: Serializer;
  export const dxfSerializer: Serializer;
  export const jsonSerializer: Serializer;
  export const objSerializer: Serializer;
  export const stlSerializer: Serializer;
  export const svgSerializer: Serializer;
  export const x3dSerializer: Serializer;
  export const m3fSerializer: Serializer;
  export const deserializers: Record<string, Deserializer>;
}
