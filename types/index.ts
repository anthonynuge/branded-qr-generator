export type QRContentMode = 'url' | 'text' | 'vcard';

export interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  website: string;
}

export type QRContent =
  | { mode: 'url'; value: string }
  | { mode: 'text'; value: string }
  | { mode: 'vcard'; data: VCardData };

export interface ExtractedPalette {
  dominant: [number, number, number];
  palette: Array<[number, number, number]>;
}

export type DotStyle = 'square' | 'rounded' | 'circle';

export interface QRRenderOptions {
  moduleSize: number;
  dotStyle: DotStyle;
  dotScale: number; // 0.4–1.0, fraction of module covered by the dot
  bgColor: string;
  finderColor: string;
}
