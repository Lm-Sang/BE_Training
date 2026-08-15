const layDuLieu = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Đây là dữ liệu bí mật của hệ thống");
    }, 2000);
  });
};

const chayThu = async () => {
  console.log("Bắt đầu chạy thử");
  const duLieu = await layDuLieu();
  console.log(duLieu);
  console.log("Kết thúc chạy thử");
};

chayThu();
