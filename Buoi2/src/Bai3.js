const chiaHaiSo = (a, b) => {
  if (b === 0) {
    throw new Error("Không thể chia cho 0 được bạn eii");
  }
  return a / b;
};

const main = async () => {
  try {
    const ketQua = chiaHaiSo(10, 0);
    console.log("Kết quả: " + ketQua);
  } catch (error) {
    console.error(error.message);
  }
};

main();
