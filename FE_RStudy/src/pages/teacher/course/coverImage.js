const WIDTH = 1280;
const HEIGHT = 720;
const MIN_WIDTH = 640;
const MIN_HEIGHT = 360;

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Không đọc được ảnh"));
    };
    image.src = url;
  });

export async function toCoverFile(file) {
  const image = await loadImage(file);
  if (image.width < MIN_WIDTH || image.height < MIN_HEIGHT) throw new Error(`Ảnh quá nhỏ, cần tối thiểu ${MIN_WIDTH}x${MIN_HEIGHT}`);

  const ratio = WIDTH / HEIGHT;
  let cropWidth = image.width;
  let cropHeight = image.height;
  if (cropWidth / cropHeight > ratio) cropWidth = cropHeight * ratio;
  else cropHeight = cropWidth / ratio;

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, WIDTH, HEIGHT);
  context.drawImage(image, (image.width - cropWidth) / 2, (image.height - cropHeight) / 2, cropWidth, cropHeight, 0, 0, WIDTH, HEIGHT);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  if (!blob) throw new Error("Không xử lý được ảnh");
  return new File([blob], "cover.jpg", { type: "image/jpeg" });
}
