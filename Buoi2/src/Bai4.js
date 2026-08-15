const congTy = {
  tenSep: "Anh Tùng",
  baoCao: function () {
    setTimeout(() => {
      console.log("Sếp " + this.tenSep + " đang đợi báo cáo!");
    }, 1000);
  },
};

congTy.baoCao();
