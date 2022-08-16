const { createApp, ref, onMounted } = Vue;

const app = createApp({
  setup() {
    const url = "http://localhost:5000/warga";

    const warga = ref({
      id: null,
      nik: "",
      nama: "",
      jenisKelamin: "",
      status: "",
      list: [],
      errorMessage: "",
      isError: false,
      isUpdate: false,
    });

    const getWarga = async () => {
      try {
        warga.value.isUpdate = false;
        const resWarga = await axios.get(url);
        if (resWarga.data.length === 0)
          throw new Error("Data warga tidak ditemukan");
        warga.value.list = resWarga.data;
        return resWarga.data;
      } catch (err) {
        warga.value.isError = true;
        warga.value.errorMessage = err.message;
        warga.value.isUpdate = false;
      }
    };

    const getWargaById = async (id) => {
      try {
        const resWarga = await axios.get(url + `/${id}`);
        if (resWarga.data.length === 0)
          throw new Error("Data warga tidak ditemukan");
        warga.value.isUpdate = true;
        warga.value.id = id;
        warga.value.nik = resWarga.data.nik;
        warga.value.nama = resWarga.data.nama;
        warga.value.jenisKelamin= resWarga.data.jenisKelamin;
        warga.value.status= resWarga.data.status;
        return resWarga.data;
      } catch (err) {
        warga.value.nik = "";
        warga.value.nama = "";
        warga.value.jenisKelamin = "";
        warga.value.status= "";
        warga.value.isUpdate = false;
        warga.value.isError = true;
        warga.value.errorMessage = err.message;
      }
    };
//Fungsi untuk menghapus data warga 
    const deleteWarga = async (id) => {
      try {
        warga.value.isUpdate = false;
        const resWarga = await axios.delete(url + "/delete", {
          data: {
            id,
          },
        });
        if (resWarga.data.length === 0)
          throw new Error("Data warga tidak ada");
        warga.value.list = resWarga.data;
        alert('Data berhasil di hapus');
        await getWarga();
        return resWarga.data;
      } catch (err) {
        warga.value.isError = true;
        warga.value.errorMessage = err.message;
      }
    };

    const submitWarga = async () => {
      try {
        warga.value.isUpdate = false;
        const post = await axios.post(url + "/create", {
          nik: warga.value.nik,
          nama: warga.value.nama,
          jenisKelamin: warga.value.jenisKelamin,
          status: warga.value.status,
        });
        warga.value.isError = false;
        warga.value.nik = "";
        warga.value.nama = "";
        warga.value.jenisKelamin = "";
        warga.value.status = "";
        warga.value.isUpdate = false;
        if (!post) throw new Error("Data warga tidak berhasil dibuat");
        await getWarga();
        alert('Warga berhasil ditambahkan');
      } catch (err) {
        warga.value.isError = true;
        warga.value.errorMessage = err.message;
      }
    };

    const updateWarga = async () => {
      try {
        warga.value.isUpdate = true;
        const put = await axios.put(url + "/update", {
          id: warga.value.id,
          nik: warga.value.nik,
          nama: warga.value.nama,
          jenisKelamin: warga.value.jenisKelamin,
          status: warga.value.status,
        });
        warga.value.isError = false;
        warga.value.nik = "";
        warga.value.nama = "";
        warga.value.jenisKelamin = "";
        warga.value.status = "";
        warga.value.isUpdate = false;
        warga.value.isError = true;
        if (!put) throw new Error("Data warga tidak berhasil diperbaharui");
        await getWarga();
        alert('Data warga berhasil diperbaharui');
      } catch (err) {
        warga.value.isUpdate = false;
        warga.value.isError = true;
        warga.value.errorMessage = err.message;
      }
    };


    onMounted(async () => {
      await getWarga();
    });

    return {
      warga,
      submitWarga,
      updateWarga,
      deleteWarga,
      getWargaById,
    };
  },
});

app.mount("#app");

