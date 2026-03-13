import qrcode from 'qrcode';

export interface QRMatrix {
  data: boolean[][];
  size: number;
}

export function generateMatrix(content: string): QRMatrix {
  const qr = qrcode.create(content, {
    errorCorrectionLevel: 'H',
  });

  const size = qr.modules.size;
  const data: boolean[][] = [];

  for (let row = 0; row < size; row++) {
    data[row] = [];
    for (let col = 0; col < size; col++) {
      data[row][col] = qr.modules.get(row, col) === 1;
    }
  }

  return { data, size };
}
