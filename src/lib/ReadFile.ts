export default (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = reject;
    reader.onload = () => {
      resolve(<ArrayBuffer>reader.result);
    };
    reader.readAsArrayBuffer(file);
  });
}